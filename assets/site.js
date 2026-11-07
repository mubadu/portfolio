// Shared behaviour: nav hairline, copy email, smooth scroll with nav offset, one hero moment, reveals.
(function () {
  var nav = document.getElementById('nav');
  if (nav) { var f = function () { nav.classList.toggle('scrolled', window.scrollY > 8); }; f(); addEventListener('scroll', f, { passive: true }); }

  var b = document.getElementById('copy-email');
  if (b) b.addEventListener('click', function () {
    var t = 'basim.durrani@gmail.com';
    var done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy'; }, 1600); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, function () { b.textContent = 'Select and copy'; });
    else b.textContent = 'Select and copy';
  });

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rv = document.querySelectorAll('.rv');
  var show = function () { rv.forEach(function (e) { e.style.opacity = 1; e.style.transform = 'none'; }); };
  if (reduce || !window.gsap) { show(); return; }

  gsap.registerPlugin(ScrollTrigger);
  var lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: .12 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  // in-page links land below the sticky nav, with or without smooth scrolling
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute('href'); if (id.length < 2) return;
    var el = document.querySelector(id); if (!el) return;
    e.preventDefault();
    var off = -(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64) - 20;
    if (lenis) lenis.scrollTo(id === '#top' ? 0 : el, { offset: id === '#top' ? 0 : off });
    else window.scrollTo({ top: id === '#top' ? 0 : el.getBoundingClientRect().top + scrollY + off, behavior: 'smooth' });
    history.replaceState(null, '', id);
  });

  // signature moment (home only): the two brand cards deal in, then fan apart on scroll
  if (document.querySelector('.stack')) {
    var tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.2 } });
    tl.from('.card.el', { y: 60, rotate: 10, opacity: 0 }, 0).from('.card.se', { y: 80, rotate: -16, opacity: 0 }, .12).from('.tag', { y: 16, opacity: 0, stagger: .1, duration: .8 }, .5);
    gsap.to('.card.se', { rotate: -11, xPercent: -6, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.card.el', { rotate: 6, xPercent: 5, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }
  rv.forEach(function (e) {
    var inHero = e.closest('.hero, .page-hero');
    gsap.to(e, inHero ? { opacity: 1, y: 0, duration: 1, ease: 'expo.out', delay: .05 } : { opacity: 1, y: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: e, start: 'top 90%', once: true } });
  });
  // safety: never leave content hidden if a trigger misses (e.g. very short pages, print, anchor jumps)
  setTimeout(function () { ScrollTrigger.refresh(); }, 600);
  addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
