document.addEventListener('DOMContentLoaded', function () {

  // ── PARTICLE FIELD ──
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = document.body.scrollHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.z = Math.random() * 800 + 200;
      this.s = Math.random() * 1.5 + 0.3;
      this.vy = -(Math.random() * 0.12 + 0.02);
      this.vx = (Math.random() - 0.5) * 0.06;
      this.o = Math.random() * 0.45 + 0.08;
      this.h = Math.random() > 0.65 ? 190 : 68;
    }
    update(t) {
      this.y += this.vy;
      this.x += this.vx + Math.sin(t * 0.0004 + this.y * 0.005) * 0.15;
      this.z += Math.sin(t * 0.0003 + this.x * 0.008) * 0.4;
      if (this.y < -10) {
        this.y = H + 10;
        this.x = Math.random() * W;
      }
    }
    draw() {
      var p = 500 / (500 + this.z);
      var px = (this.x - W / 2) * p + W / 2;
      var py = (this.y - H / 2) * p + H / 2;
      var sz = this.s * p;
      ctx.beginPath();
      ctx.arc(px, py, sz, 0, Math.PI * 2);
      ctx.fillStyle = 'hsla(' + this.h + ',100%,70%,' + (this.o * p) + ')';
      ctx.fill();
    }
  }

  var particles = [];

  function initParticles() {
    particles = [];
    var count = Math.min(200, Math.floor(W * H / 8000));
    for (var i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawLines() {
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var d = dx * dx + dy * dy;
        if (d < 18000) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(200,255,0,' + (0.018 * (1 - d / 18000)) + ')';
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }
    }
  }

  function tick(t) {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(function (p) {
      p.update(t);
      p.draw();
    });
    drawLines();
    requestAnimationFrame(tick);
  }

  resize();
  initParticles();
  requestAnimationFrame(tick);
  window.addEventListener('resize', function () { resize(); initParticles(); });

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
        }, Math.max(0, idx) * 130);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.06 });
  revEls.forEach(function (el) { observer.observe(el); });

  // ── PARALLAX (mouse) ──
  document.addEventListener('mousemove', function (e) {
    var mx = (e.clientX / window.innerWidth - 0.5) * 2;
    var my = (e.clientY / window.innerHeight - 0.5) * 2;
    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      var s = parseFloat(el.dataset.parallax);
      el.style.transform = 'translate(' + (mx * s * 40) + 'px,' + (my * s * 25) + 'px)';
    });
  });

  // ── CARD TILT ──
  document.querySelectorAll('[data-tilt]').forEach(function (c) {
    c.addEventListener('mousemove', function (e) {
      var r = c.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width) * 100;
      var y = ((e.clientY - r.top) / r.height) * 100;
      c.style.setProperty('--mx', x + '%');
      c.style.setProperty('--my', y + '%');
      c.style.transform = 'perspective(800px) rotateX(' + ((y - 50) * 0.12) + 'deg) rotateY(' + ((x - 50) * -0.12) + 'deg) translateY(-8px) scale(1.02)';
    });
    c.addEventListener('mouseleave', function () {
      c.style.transform = '';
    });
  });

  // ── MAGNETIC BUTTONS ──
  document.querySelectorAll('.magnetic').forEach(function (b) {
    b.addEventListener('mousemove', function (e) {
      var r = b.getBoundingClientRect();
      b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.2) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.2) + 'px) scale(1.04)';
    });
    b.addEventListener('mouseleave', function () {
      b.style.transform = '';
    });
  });

  // ── ORB PARALLAX (scroll) ──
  var orb1 = document.querySelector('.orb-1');
  var orb2 = document.querySelector('.orb-2');
  var orb3 = document.querySelector('.orb-3');
  window.addEventListener('scroll', function () {
    var s = window.scrollY;
    if (orb1) orb1.style.transform = 'translate(' + (Math.sin(s * 0.002) * 50) + 'px,' + (s * -0.1) + 'px)';
    if (orb2) orb2.style.transform = 'translate(' + (Math.cos(s * 0.002) * 40) + 'px,' + (s * 0.06) + 'px)';
    if (orb3) orb3.style.transform = 'translate(' + (Math.sin(s * 0.003) * 25) + 'px,' + (s * -0.04) + 'px)';
  });

  // ── SMOOTH NAV ──
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

});
