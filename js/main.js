const nav = document.querySelector('.site-nav');
const hero = document.querySelector('.cinematic-hero');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Give the hero a quiet sense of depth without turning the page into a gimmick.
if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 2;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;
    hero.style.setProperty('--mx', `${x * 10}px`);
    hero.style.setProperty('--my', `${y * 8}px`);
  }, { passive: true });
}
