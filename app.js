/**
 * Зовнішній скрипт головної (лабораторна, п. 1–2).
 *
 * П.1: dialogWithUser — змінні, розгалуження, цикл; showDeveloper (посада за замовчуванням);
 *       compareStringsAlert; flashPageBackground через document.body.
 * П.2: redirectWithLocation; getElementById / querySelectorAll; textContent, innerHTML,
 *       outerHTML, nodeValue, dataset; document.write; createElement, createTextNode;
 *       append, prepend, after, replaceWith, remove — у domManipulationDemo та documentWriteDemoWindow.
 */

/** Діалог з користувачем — змінні, умовне розгалуження, цикл. */
function dialogWithUser() {
  const max = 3;
  const lines = [];
  let i;
  for (i = 1; i <= max; i++) {
    const line = window.prompt(
      "TaskBoard — чернетка списку (пункт " +
        i +
        " з " +
        max +
        ").\n\n" +
        "Введіть короткий пункт: наприклад назву завдання, крок до проєкту чи нагадування з календаря.\n" +
        "Порожній рядок (лише пробіли) буде пропущено.\n" +
        "«Скасувати» — закінчити введення раніше.",
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
    window.alert("TaskBoard: чернетка порожня — додайте хоча б один пункт і спробуйте знову.");
    return;
  }
  if (
    window.confirm(
      "TaskBoard: у чернетці " +
        lines.length +
        " пункт(ів).\n\nПоказати їх одним вікном alert (як тимчасовий список)?"
    )
  ) {
    window.alert("Чернетка TaskBoard:\n\n" + lines.join("\n"));
  }
}

function showDeveloper(lastName, firstName, position) {
  if (position === undefined) {
    position = "Авторка сторінки TaskBoard";
  }
  window.alert("TaskBoard — розробник:\n\n" + lastName + " " + firstName + "\nПосада: " + position);
}

function compareStringsAlert(a, b) {
  const s1 = a === null || a === undefined ? "" : String(a);
  const s2 = b === null || b === undefined ? "" : String(b);
  const greater = s1.localeCompare(s2) >= 0 ? s1 : s2;
  window.alert(
    "TaskBoard — порівняння двох рядків за алфавітом (як у словнику), а не за довжиною.\n\n" +
      "Пізніший за алфавітом рядок (метод localeCompare):\n\n" +
      greater
  );
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

function documentWriteDemoWindow() {
  const w = window.open("", "_blank", "width=400,height=180");
  if (!w) {
    return;
  }
  w.document.write(
    "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><title>TaskBoard — document.write</title></head><body><p>Попередній перегляд через document.write (демо для TaskBoard).</p></body></html>"
  );
  w.document.close();
}

function domManipulationDemo() {
  const playground = document.getElementById("dom-sandbox");
  if (!playground) {
    return;
  }

  const rows = playground.querySelectorAll(".sandbox-line");
  let msg = "";

  if (rows.length > 0) {
    rows[0].textContent = rows[0].textContent + " [textContent]";
    msg += "outerHTML (фрагмент, рядок 1):\n" + rows[0].outerHTML.slice(0, 100) + "…\n\n";
  }
  if (rows.length > 1) {
    rows[1].innerHTML = "<strong>innerHTML</strong> у другому рядку";
    msg += "outerHTML (фрагмент, рядок 2):\n" + rows[1].outerHTML.slice(0, 100) + "…\n\n";
  }

  const host = document.getElementById("author-snippet");
  if (host) {
    msg += "data (dataset.role з data-role):\n" + host.dataset.role + "\n\n";
    host.textContent = "Рядок автора оновлено через textContent після читання dataset.";
  }

  const c = document.createComment(" lab-dom-comment ");
  playground.insertBefore(c, playground.firstChild);
  msg += "nodeValue для вузла-коментаря:\n«" + c.nodeValue + "»";

  window.alert("TaskBoard — п.2: getElementById, querySelectorAll; textContent, innerHTML, outerHTML, dataset, nodeValue:\n\n" + msg);

  const pNew = document.createElement("p");
  pNew.append(document.createTextNode("createTextNode + "));
  pNew.append("append (рядок)");
  playground.prepend(pNew);

  const mark = document.createElement("span");
  mark.textContent = "×";
  const lastEl = playground.lastElementChild;
  if (lastEl) {
    lastEl.after(mark);
  }

  const repl = document.createElement("p");
  repl.textContent = "replaceWith";
  mark.replaceWith(repl);

  const ghost = document.createElement("small");
  ghost.textContent = "remove";
  repl.after(ghost);
  ghost.remove();
}

function runDeveloperDemos() {
  showDeveloper("Машковцева", "Софія");
}

document.addEventListener("DOMContentLoaded", function () {
  const pairs = [
    ["btn-user-lines", dialogWithUser],
    ["btn-author-card", runDeveloperDemos],
    [
      "btn-string-compare",
      function () {
        compareStringsAlert(
          window.prompt(
            "TaskBoard — порівняння за алфавітом (не за довжиною).\n\nПерший рядок:",
            ""
          ),
          window.prompt("Другий рядок:", "")
        );
      },
    ],
    [
      "btn-temp-background",
      function () {
        window.alert(
          "TaskBoard: на 30 секунд зміниться фон головної сторінки (document.body), потім повернеться як був."
        );
        flashPageBackground(30);
      },
    ],
    ["btn-open-tasks", redirectWithLocation],
    ["btn-dom-demo", domManipulationDemo],
    ["btn-document-write", documentWriteDemoWindow],
  ];
  let j;
  for (j = 0; j < pairs.length; j++) {
    const btn = document.getElementById(pairs[j][0]);
    if (btn) {
      btn.addEventListener("click", pairs[j][1]);
    }
  }
});
