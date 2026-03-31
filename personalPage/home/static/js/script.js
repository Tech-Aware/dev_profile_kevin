document.addEventListener('DOMContentLoaded', function () {

  // ── NAV SCROLL EFFECT ──
  var nav = document.querySelector('nav');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // ── SCROLL REVEAL ──
  var revEls = document.querySelectorAll('.reveal, .reveal-3d');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var parent = e.target.parentElement;
        var siblings = Array.from(parent.children).filter(function (c) {
          return c.classList.contains('reveal') || c.classList.contains('reveal-3d');
        });
        var idx = siblings.indexOf(e.target);
        setTimeout(function () {
          e.target.classList.add('visible');
        }, Math.max(0, idx) * 100);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.06 });
  revEls.forEach(function (el) { observer.observe(el); });

  // ── SMOOTH NAV ──
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

});
