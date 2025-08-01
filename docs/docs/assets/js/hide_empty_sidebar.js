
document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".md-sidebar--primary .md-nav__list");

  if (!sidebar) return;

  const items = sidebar.querySelectorAll("li.md-nav__item");
  const active = sidebar.querySelector("li.md-nav__item--active");

  // If only the active item exists and no nested items are present, hide sidebar
  if (items.length === 1 && active && !active.querySelector("ul")) {
    document.querySelector(".md-sidebar--primary").style.display = "none";
    document.querySelector(".md-main__inner").style.gridTemplateColumns = "1fr auto";
  }
});
