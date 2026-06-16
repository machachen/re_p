// BPM Intelligence — shared UI behaviours (mobile nav drawer)
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var shell = document.querySelector('.app-shell');
    var toggle = document.getElementById('nav-toggle');
    var backdrop = document.getElementById('sidebar-backdrop');
    if (!shell || !toggle) return;

    function setOpen(open) {
      shell.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    toggle.addEventListener('click', function () {
      setOpen(!shell.classList.contains('nav-open'));
    });
    if (backdrop) backdrop.addEventListener('click', function () { setOpen(false); });

    // Close the drawer when a sidebar link is tapped.
    var sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    // Reset when resizing back up to desktop.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) setOpen(false);
    });
  });
})();
