document.addEventListener('DOMContentLoaded', function () {
  // Reveal a collapsed project when reached from an existing direct link.
  function revealLinkedProject() {
    var target;
    try { target = document.getElementById(decodeURIComponent(window.location.hash.slice(1))); }
    catch (error) { return; }
    if (!target) return;
    var disclosure = target.closest('details');
    if (disclosure && !disclosure.open) {
      disclosure.open = true;
      window.requestAnimationFrame(function () { target.scrollIntoView({ block: 'start' }); });
    }
  }
  window.addEventListener('hashchange', revealLinkedProject);
  revealLinkedProject();
  var nav = document.querySelector('nav');
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (nav && toggle && links) {
    function closeMenu(restoreFocus) {
      nav.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      if (restoreFocus) toggle.focus();
    }
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('menu-open', open);
    });
    links.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu(true);
      }
    });
    document.addEventListener('click', function (event) {
      if (!nav.contains(event.target)) closeMenu(false);
    });
    var wideScreen = window.matchMedia('(min-width: 981px)');
    wideScreen.addEventListener('change', function (event) {
      if (event.matches) closeMenu(false);
    });
    // Only collapse the mobile links once the controls have been initialized.
    document.documentElement.classList.add('js');
    function updateNav() {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }
  // Reveals are decorative: content is visible before and without this code.
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06 });
    document.querySelectorAll('.reveal, .reveal-3d').forEach(function (element) {
      observer.observe(element);
    });
  }
});
