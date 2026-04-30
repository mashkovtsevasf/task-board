/**
 * Скрипт головної TaskBoard: чернетка, порівняння назв, вигляд сторінки, довідка, мітки та команди дошки.
 */

const HOMEDRAFT_STORAGE_KEY = "taskboardHomeDraftJson";
const HOMEDRAFT_UPDATED_KEY = "taskboardHomeDraftUpdated";
const FOCUS_INDEX_KEY = "taskboardFocusIndex";

const HOME_DRAFT_DEMO_LINES = [
  "Завдання: перевірити список на tasks.html",
  "Проєкт: оформлення TaskBoard",
];

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function readHomeDraftLines() {
  try {
    const raw = localStorage.getItem(HOMEDRAFT_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (typeof parsed === "string" && parsed.trim()) {
      return [parsed.trim()];
    }
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter(function (x) {
        return typeof x === "string" && x.trim();
      })
      .map(function (x) {
        return String(x).trim();
      })
      .slice(0, 10);
  } catch (e) {
    return [];
  }
}

function persistHomeDraft(lines) {
  const clean = lines
    .filter(function (s) {
      return s && String(s).trim();
    })
    .map(function (s) {
      return String(s).trim();
    })
    .slice(0, 10);
  try {
    localStorage.setItem(HOMEDRAFT_STORAGE_KEY, JSON.stringify(clean));
    localStorage.setItem(HOMEDRAFT_UPDATED_KEY, String(Date.now()));
    return true;
  } catch (e) {
    return false;
  }
}

function getDraftUpdatedLabel() {
  try {
    const t = localStorage.getItem(HOMEDRAFT_UPDATED_KEY);
    if (!t) {
      return "";
    }
    const ms = Number(t);
    if (!Number.isFinite(ms)) {
      return "";
    }
    const d = new Date(ms);
    try {
      return d.toLocaleString("uk-UA", { dateStyle: "short", timeStyle: "short" });
    } catch (e2) {
      return d.toLocaleString("uk-UA");
    }
  } catch (e) {
    return "";
  }
}

function renderDraftInSandbox(lines) {
  const playground = document.getElementById("dom-sandbox");
  if (!playground) {
    return;
  }
  const list = lines && lines.length ? lines : readHomeDraftLines();
  playground.textContent = "";
  if (!list.length) {
    const p0 = document.createElement("p");
    p0.className = "sandbox-line";
    p0.textContent = "Порожньо — додай рядки кнопкою «Швидкі три рядки в чернетку».";
    playground.appendChild(p0);
    return;
  }
  let i;
  for (i = 0; i < list.length; i++) {
    const p = document.createElement("p");
    p.className = "sandbox-line";
    p.textContent = list[i];
    playground.appendChild(p);
  }
  const host = document.getElementById("author-snippet");
  if (host) {
    const role = host.dataset.role || "автор";
    const when = getDraftUpdatedLabel();
    host.textContent =
      "Останнє оновлення чернетки: " + (when || "щойно") + ". Рядок про " + role + ".";
  }
}

function fillTasksDraftHost() {
  const el = document.getElementById("tasks-home-draft");
  if (!el) {
    return;
  }
  const draftLines = readHomeDraftLines();
  el.textContent = "";
  if (!draftLines.length) {
    const empty = document.createElement("p");
    empty.className = "tasks-home-draft__hint";
    empty.textContent = "Немає збережених рядків — збережи чернетку на головній.";
    el.appendChild(empty);
    return;
  }
  const ul = document.createElement("ul");
  draftLines.forEach(function (text) {
    const li = document.createElement("li");
    li.textContent = text;
    ul.appendChild(li);
  });
  el.appendChild(ul);
  const when = getDraftUpdatedLabel();
  if (when) {
    const small = document.createElement("p");
    small.className = "tasks-home-draft__hint";
    small.style.marginTop = "0.5rem";
    small.textContent = "Час оновлення: " + when;
    el.appendChild(small);
  }
}

function loadSavedDraftIntoSandbox() {
  const lines = readHomeDraftLines();
  if (lines.length) {
    renderDraftInSandbox(lines);
  }
}

function restoreFocusFromStorage() {
  const list = document.getElementById("tb-focus-list");
  if (!list) {
    return;
  }
  let idx;
  try {
    idx = parseInt(localStorage.getItem(FOCUS_INDEX_KEY), 10);
  } catch (e) {
    return;
  }
  if (!Number.isFinite(idx) || idx < 0) {
    return;
  }
  const items = list.querySelectorAll(".tb-focus-list__item");
  if (idx >= items.length) {
    return;
  }
  items.forEach(function (n) {
    n.classList.remove("is-selected");
  });
  items[idx].classList.add("is-selected");
}

/** Швидка чернетка з кількох рядків (діалог з користувачем). */
function dialogWithUser() {
  const max = 3;
  const lines = [];
  let i;
  for (i = 1; i <= max; i++) {
    const line = window.prompt(
      "Чернетка — рядок " + i + " з " + max + ".\n\nЩо записати?",
      ""
    );
    if (line === null) {
      break;
    }
    if (line.trim() === "") {
      continue;
    }
    lines.push(line.trim());
  }
  if (lines.length === 0) {
    window.alert("Поки порожньо — додай хоча б один рядок.");
    return;
  }
  if (
    !window.confirm(
      "Зберегти " +
        lines.length +
        " рядків у чернетці в цьому браузері й показати їх у блоці внизу та на сторінці «Завдання»?"
    )
  ) {
    return;
  }
  if (!persistHomeDraft(lines)) {
    window.alert("Не вдалося зберегти чернетку (пам’ять браузера недоступна або переповнена). Спробуй ще раз або перевір налаштування.");
    return;
  }
  renderDraftInSandbox(lines);
  fillTasksDraftHost();
  const when = getDraftUpdatedLabel();
  taskboardStatusLine("Чернетку збережено" + (when ? " (мітка часу: " + when + ")." : "."));
}

function showDeveloper(lastName, firstName, position) {
  if (position === undefined) {
    position = "Авторка сторінки TaskBoard";
  }
  window.alert(lastName + " " + firstName + "\n" + position);
}

function compareStringsAlert(a, b) {
  const s1 = a === null || a === undefined ? "" : String(a);
  const s2 = b === null || b === undefined ? "" : String(b);
  const greater = s1.localeCompare(s2) >= 0 ? s1 : s2;
  window.alert("Пізнішою за алфавітом буде:\n\n" + greater);
}

function flashPageBackground(seconds) {
  let sec = seconds === undefined ? 30 : Number(seconds);
  if (Number.isNaN(sec) || sec < 1) {
    sec = 30;
  }
  const body = document.body;
  const prevColor = body.style.getPropertyValue("background-color");
  const prevPri = body.style.getPropertyPriority("background-color");
  body.style.setProperty("background-color", "#fef9c3", "important");
  window.setTimeout(function () {
    if (prevColor) {
      if (prevPri === "important") {
        body.style.setProperty("background-color", prevColor, "important");
      } else {
        body.style.setProperty("background-color", prevColor);
      }
    } else {
      body.style.removeProperty("background-color");
    }
  }, sec * 1000);
}

function redirectWithLocation() {
  window.location.assign("tasks.html");
}

function buildDraftPreviewDocumentHtml() {
  const lines = readHomeDraftLines();
  const when = getDraftUpdatedLabel();
  let bodyHtml =
    "<h1 style=\"font-size:1.1rem;margin:0 0 0.5rem;\">TaskBoard</h1>";
  if (when) {
    bodyHtml +=
      "<p style=\"color:#555;font-size:0.85rem;margin:0 0 0.75rem;\">Чернетка збережена: " +
      escapeHtml(when) +
      "</p>";
  }
  if (!lines.length) {
    bodyHtml += "<p>Чернетка порожня — заповни її на головній.</p>";
  } else {
    bodyHtml += "<ol style=\"margin:0;padding-left:1.25rem;\">";
    let i;
    for (i = 0; i < lines.length; i++) {
      bodyHtml += "<li>" + escapeHtml(lines[i]) + "</li>";
    }
    bodyHtml += "</ol>";
  }
  return (
    "<!DOCTYPE html><html lang=\"uk\"><head><meta charset=\"UTF-8\"><title>TaskBoard — перегляд</title>" +
    "<style>body{font-family:system-ui,sans-serif;padding:1rem;line-height:1.45;}</style></head><body>" +
    bodyHtml +
    "</body></html>"
  );
}

function documentWriteDemoWindow() {
  const html = buildDraftPreviewDocumentHtml();
  let url;
  try {
    url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
  } catch (e) {
    window.alert("Не вдалося підготувати перегляд. Спробуй оновити сторінку.");
    return;
  }
  const w = window.open(url, "_blank");
  if (!w) {
    try {
      URL.revokeObjectURL(url);
    } catch (e2) {}
    window.alert("Не вдалося відкрити вікно — перевір, чи дозволені спливаючі вікна для TaskBoard.");
    return;
  }
  try {
    w.opener = null;
  } catch (e3) {}
  function revokeWhenReady() {
    try {
      URL.revokeObjectURL(url);
    } catch (e4) {}
  }
  if (w.document && w.document.readyState === "complete") {
    window.setTimeout(revokeWhenReady, 500);
  } else {
    w.addEventListener("load", function onPreviewLoad() {
      w.removeEventListener("load", onPreviewLoad);
      window.setTimeout(revokeWhenReady, 500);
    });
  }
  try {
    w.focus();
  } catch (e5) {}
  taskboardStatusLine("Відкрито швидкий перегляд чернетки.");
}

function resetAuthorSnippetWhenNoDraft() {
  const host = document.getElementById("author-snippet");
  if (host) {
    const role = host.dataset.role || "автор";
    host.textContent =
      "Рядок про " +
      role +
      " — натисни «Швидкі три рядки в чернетку» вище, щоб зберегти рядки й час оновлення тут.";
  }
}

function paintDemoSandboxLines() {
  const playground = document.getElementById("dom-sandbox");
  if (!playground) {
    return;
  }
  playground.textContent = "";
  let i;
  for (i = 0; i < HOME_DRAFT_DEMO_LINES.length; i++) {
    const p = document.createElement("p");
    p.className = "sandbox-line";
    p.textContent = HOME_DRAFT_DEMO_LINES[i];
    playground.appendChild(p);
  }
}

/** Скидає збережену чернетку в localStorage і повертає стартовий приклад у блоці (окремо від автооновлення після збереження). */
function clearSavedHomeDraft() {
  let hasDraftKey = false;
  try {
    hasDraftKey = localStorage.getItem(HOMEDRAFT_STORAGE_KEY) !== null;
  } catch (e) {}
  const lines = readHomeDraftLines();
  if (!hasDraftKey && lines.length === 0) {
    taskboardStatusLine("У браузері немає збереженої чернетки.");
    return;
  }
  const msg =
    lines.length > 0
      ? "Видалити збережені рядки чернетки з цього браузера й показати початковий приклад унизу?"
      : "Прибрати запис чернетки в браузері й показати початковий приклад унизу?";
  if (!window.confirm(msg)) {
    return;
  }
  try {
    localStorage.removeItem(HOMEDRAFT_STORAGE_KEY);
    localStorage.removeItem(HOMEDRAFT_UPDATED_KEY);
  } catch (e) {
    window.alert("Не вдалося очистити пам’ять браузера.");
    return;
  }
  paintDemoSandboxLines();
  resetAuthorSnippetWhenNoDraft();
  fillTasksDraftHost();
  const card = document.getElementById("tb-draft-card");
  if (card) {
    window.requestAnimationFrame(function () {
      card.classList.add("tb-sandbox-spotlight");
      window.setTimeout(function () {
        card.classList.remove("tb-sandbox-spotlight");
      }, 600);
    });
  }
  taskboardStatusLine("Збережену чернетку скинуто — унизу знову приклад як на старті.");
}

function runDeveloperDemos() {
  showDeveloper("Машковцева", "Софія");
}

function taskboardStatusLine(text) {
  const out = document.getElementById("tb-event-log");
  if (out) {
    out.textContent = text;
  }
}

window.taskboardZoneEnterAttr = function () {
  taskboardStatusLine("Курсор у зоні швидкого статусу TaskBoard.");
};

function taskboardZoneLeaveProp() {
  taskboardStatusLine("Курсор поза зоною швидкого статусу.");
}

function taskboardCanvasClickFirst() {
  taskboardStatusLine("Журнал: клік по зоні швидкого статусу зафіксовано.");
}

function taskboardCanvasClickSecond() {
  const out = document.getElementById("tb-event-log");
  if (!out) {
    return;
  }
  out.textContent += " Оновлено нагадування для цього ж кліку.";
}

const taskboardBehaviors = {
  pin(li) {
    const label = (li && li.textContent ? li.textContent : "").trim();
    taskboardStatusLine("Обрано: «" + label + "».");
    const list = document.getElementById("tb-focus-list");
    if (!list || !li) {
      return;
    }
    const items = list.querySelectorAll(".tb-focus-list__item");
    let idx = -1;
    let i;
    for (i = 0; i < items.length; i++) {
      if (items[i] === li) {
        idx = i;
        break;
      }
    }
    if (idx >= 0) {
      try {
        localStorage.setItem(FOCUS_INDEX_KEY, String(idx));
      } catch (e) {}
    }
  },
  scrollDraft() {
    const anchor = document.getElementById("tb-draft-card") || document.getElementById("dom-sandbox");
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    taskboardStatusLine("Прокручено до блоку «Чернетка на головній».");
  },
  clearPins() {
    document.querySelectorAll("#tb-focus-list .tb-focus-list__item.is-selected").forEach(function (node) {
      node.classList.remove("is-selected");
    });
    try {
      localStorage.removeItem(FOCUS_INDEX_KEY);
    } catch (e) {}
    taskboardStatusLine("Вибір у списку знято.");
  },
  emphasizeSandbox() {
    const box = document.getElementById("tb-draft-card") || document.getElementById("dom-sandbox");
    if (!box) {
      return;
    }
    box.classList.add("tb-sandbox-spotlight");
    window.setTimeout(function () {
      box.classList.remove("tb-sandbox-spotlight");
    }, 900);
    taskboardStatusLine("Блок чернетки підсвічено на мить.");
  },
};

window.taskboardListSelect = function (event) {
  const li = event.target.closest(".tb-focus-list__item");
  if (!li || !event.currentTarget.contains(li)) {
    return;
  }
  event.currentTarget.querySelectorAll(".tb-focus-list__item").forEach(function (node) {
    node.classList.remove("is-selected");
  });
  li.classList.add("is-selected");
  const key = li.dataset.behavior;
  if (key && typeof taskboardBehaviors[key] === "function") {
    taskboardBehaviors[key](li);
  }
};

function taskboardMenuClick(event) {
  const btn = event.target.closest("button[data-behavior]");
  if (!btn || !event.currentTarget.contains(btn)) {
    return;
  }
  const key = btn.dataset.behavior;
  if (key && typeof taskboardBehaviors[key] === "function") {
    taskboardBehaviors[key](event);
  }
}

const taskboardPanelTracer = {
  handleEvent(event) {
    const el = event.currentTarget;
    const tag = el && el.tagName ? el.tagName.toLowerCase() : "?";
    const id = el && el.id ? "#" + el.id : "";
    const role = el && el.dataset && el.dataset.tbRole ? el.dataset.tbRole : "Панель оголошень";
    taskboardStatusLine(
      "Журнал TaskBoard: записано дію з «" +
        role +
        "» (" +
        tag +
        id +
        ") — це currentTarget: блок, на якому «слухає» дошка."
    );
  },
};

function initTaskboardBoardUi() {
  const hit = document.getElementById("tb-canvas-hit");
  const menu = document.getElementById("tb-board-menu");
  const panel = document.getElementById("tb-target-panel");
  const unbind = document.getElementById("tb-unbind-panel-trace");

  if (hit) {
    hit.onmouseleave = taskboardZoneLeaveProp;
    hit.addEventListener("click", taskboardCanvasClickFirst);
    hit.addEventListener("click", taskboardCanvasClickSecond);
  }
  if (menu) {
    menu.addEventListener("click", taskboardMenuClick);
  }
  if (panel) {
    panel.addEventListener("click", taskboardPanelTracer);
  }
  if (panel && unbind) {
    unbind.addEventListener("click", function () {
      panel.removeEventListener("click", taskboardPanelTracer);
      taskboardStatusLine("Журнал TaskBoard: кліки панелі оголошень більше не додають записів.");
      unbind.disabled = true;
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const pairs = [
    ["btn-user-lines", dialogWithUser],
    ["btn-author-card", runDeveloperDemos],
    [
      "btn-string-compare",
      function () {
        compareStringsAlert(window.prompt("Перша назва:", ""), window.prompt("Друга назва:", ""));
      },
    ],
    [
      "btn-temp-background",
      function () {
        taskboardStatusLine("Фон головної змінено на 30 с — потім повернеться як був.");
        flashPageBackground(30);
      },
    ],
    ["btn-open-tasks", redirectWithLocation],
    ["btn-clear-home-draft", clearSavedHomeDraft],
    ["btn-document-write", documentWriteDemoWindow],
  ];
  let j;
  for (j = 0; j < pairs.length; j++) {
    const btn = document.getElementById(pairs[j][0]);
    if (btn) {
      btn.addEventListener("click", pairs[j][1]);
    }
  }
  initTaskboardBoardUi();
  loadSavedDraftIntoSandbox();
  fillTasksDraftHost();
  restoreFocusFromStorage();
});
