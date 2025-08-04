document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("a[href^='http']").forEach((link) => {
    if (!link.href.includes(location.hostname)) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener");
    }
  });
});
