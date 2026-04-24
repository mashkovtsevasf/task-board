function userDialog() {
  var max = 3;
  var lines = [];
  var i;
  for (i = 1; i <= max; i++) {
    var line = window.prompt(
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
    lines.push(line);
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
  var s1 = a === null || a === undefined ? "" : String(a);
  var s2 = b === null || b === undefined ? "" : String(b);
  var greater = s1.localeCompare(s2) >= 0 ? s1 : s2;
  window.alert(
    "TaskBoard — порівняння двох назв (алфавітний порядок).\n\n" +
      "«Більший» рядок за localeCompare:\n\n" +
      greater
  );
}

function flashPageBackground(seconds) {
  var sec = seconds === undefined ? 30 : Number(seconds);
  if (Number.isNaN(sec) || sec < 1) {
    sec = 30;
  }
  var body = document.body;
  /* У styles.css для body.page-* часто стоїть background … !important — без important інлайн не спрацює. */
  var prevColor = body.style.getPropertyValue("background-color");
  var prevPri = body.style.getPropertyPriority("background-color");
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
  var w = window.open("", "_blank", "width=400,height=180");
  if (!w) {
    return;
  }
  w.document.write(
    "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><title>TaskBoard — document.write</title></head><body><p>Попередній перегляд через document.write (демо для TaskBoard).</p></body></html>"
  );
  w.document.close();
}

function domManipulationDemo() {
  var playground = document.getElementById("dom-sandbox");
  if (!playground) {
    return;
  }

  var rows = playground.querySelectorAll(".sandbox-line");
  if (rows.length > 0) {
    rows[0].textContent = rows[0].textContent + " [textContent]";
    rows[0].innerHTML = "<b>innerHTML</b>";
  }

  var host = document.getElementById("author-snippet");
  var msg = "";
  if (host) {
    msg += "outerHTML: " + host.outerHTML.slice(0, 80) + "\n";
    host.innerHTML = "<i>innerHTML</i>";
    msg += "dataset.role: " + host.dataset.role + "\n";
  }

  var c = document.createComment("c");
  playground.insertBefore(c, playground.firstChild);
  msg += "nodeValue: " + c.nodeValue;

  window.alert("TaskBoard — фрагменти DOM (перший блок демо):\n\n" + msg);

  var pNew = document.createElement("p");
  pNew.append(document.createTextNode("createTextNode + "));
  pNew.append("append");
  playground.prepend(pNew);

  var mark = document.createElement("span");
  mark.textContent = "x";
  var lastEl = playground.lastElementChild;
  if (lastEl) {
    lastEl.after(mark);
  }

  var repl = document.createElement("p");
  repl.textContent = "replaceWith";
  mark.replaceWith(repl);

  var ghost = document.createElement("small");
  ghost.textContent = "remove";
  repl.after(ghost);
  ghost.remove();
}

function runDeveloperDemos() {
  showDeveloper("Машковцева", "Софія");
  showDeveloper("Машковцева", "Софія", "Розробниця інтерфейсу TaskBoard");
}

document.addEventListener("DOMContentLoaded", function () {
  var pairs = [
    ["btn-user-lines", userDialog],
    ["btn-author-card", runDeveloperDemos],
    [
      "btn-string-compare",
      function () {
        compareStringsAlert(
          window.prompt(
            "TaskBoard — порівняння назв.\n\nПерша назва (наприклад, завдання або проєкт):",
            ""
          ),
          window.prompt("Друга назва для порівняння:", "")
        );
      },
    ],
    [
      "btn-temp-background",
      function () {
        window.alert(
          "TaskBoard: на 30 секунд зміниться фон головної сторінки (демо document.body), потім повернеться як був."
        );
        flashPageBackground(30);
      },
    ],
    ["btn-open-tasks", redirectWithLocation],
    ["btn-dom-demo", domManipulationDemo],
    ["btn-document-write", documentWriteDemoWindow],
  ];
  var j;
  for (j = 0; j < pairs.length; j++) {
    var btn = document.getElementById(pairs[j][0]);
    if (btn) {
      btn.addEventListener("click", pairs[j][1]);
    }
  }
});
