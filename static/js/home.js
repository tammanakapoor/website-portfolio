// Home page: the desk with one identity card and a pop-up window that shows
// one of four panels (About, Projects, Hobbies, Say hello).
//
// The page loads with the About panel visible. Clicking a dock button (or pressing
// A / P / H / C) swaps the panel; Escape or the × button closes the window.
// The panel HTML lives in <template id="panel-…"> elements at the end of <main>.
(function () {
  var panels = [
    { id: "about", label: "About me", shortcut: "A" },
    { id: "projects", label: "Projects", shortcut: "P" },
    { id: "hobbies", label: "Hobbies", shortcut: "H" },
    { id: "contact", label: "Say hello", shortcut: "C" },
  ];

  var card = document.querySelector(".identity-card");
  var popup = document.querySelector(".popup-window");
  var barLabel = popup.querySelector(".window-bar > span");
  var closeButton = popup.querySelector(".window-bar button");
  var content = popup.querySelector(".window-content");
  var buttons = Array.prototype.slice.call(document.querySelectorAll(".app-dock button"));

  var active = "about";
  // null = untouched: CSS shows the panel on wide screens and keeps it closed on phones.
  var open = null;

  function findPanel(id) {
    for (var i = 0; i < panels.length; i++) if (panels[i].id === id) return panels[i];
    return panels[0];
  }

  function render(panelChanged) {
    var state = open === null ? "default" : open ? "open" : "closed";
    var label = findPanel(active).label;

    card.className = "identity-card panel-is-" + state;
    popup.className = "popup-window popup-" + active + " is-" + state;
    barLabel.textContent = "tammana / " + label.toLowerCase().replace(" ", "-");
    closeButton.setAttribute("aria-label", "Close " + label);

    buttons.forEach(function (button, i) {
      var panel = panels[i];
      button.className = active === panel.id && open !== false ? "active-" + state : "";
      button.setAttribute("aria-pressed", String(active === panel.id && open === true));
    });

    if (panelChanged) {
      // Replace the content box with a fresh one so the "panel-in" CSS animation plays again.
      var template = document.getElementById("panel-" + active);
      var fresh = content.cloneNode(false);
      fresh.appendChild(template.content.cloneNode(true));
      content.replaceWith(fresh);
      content = fresh;
    }
  }

  function showPanel(id) {
    var changed = id !== active;
    active = id;
    open = true;
    render(changed);
  }

  function closePanel() {
    open = false;
    render(false);
  }

  buttons.forEach(function (button, i) {
    button.addEventListener("click", function () { showPanel(panels[i].id); });
  });
  closeButton.addEventListener("click", closePanel);

  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closePanel();
    var key = event.key.toLowerCase();
    for (var i = 0; i < panels.length; i++) {
      if (panels[i].shortcut.toLowerCase() === key && !event.metaKey && !event.ctrlKey && !event.altKey) {
        showPanel(panels[i].id);
      }
    }
  });
})();
