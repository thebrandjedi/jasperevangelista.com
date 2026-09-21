const nav = document.querySelector('.site-nav');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const compact = window.matchMedia('(max-width: 960px)');
const clamp = (value) => Math.max(0, Math.min(1, value));
const smooth = (value) => value * value * (3 - 2 * value);

// Keep the DOM and its copy intact. Motion is applied to existing text blocks.
const moments = [...document.querySelectorAll(
  '.hero-line, #canon h2, #worlds h2, #approach h2, .illumination, .operating-code span, #lab h2, .closing h2'
)];
moments.forEach((element) => element.classList.add('motion-type'));
const scenes = [...document.querySelectorAll('.portal-scene')];
let frame = 0;

function render() {
  frame = 0;
  nav?.classList.toggle('scrolled', window.scrollY > 18);
  if (motionPreference.matches) return;
  const height = window.innerHeight;
  const distance = compact.matches ? 12 : 30;
  // A short scroll-driven approach, then a long resting state for reading.
  moments.forEach((element, index) => {
    // Layout offsets exclude our own transform and avoid scroll feedback.
    let top = -window.scrollY;
    for (let node = element; node; node = node.offsetParent) top += node.offsetTop;
    const arrival = smooth(clamp((height * .94 - top) / (height * .46)));
    const remaining = 1 - arrival;
    element.style.setProperty('--type-x', `${remaining * distance * (index % 2 ? 1 : -1)}px`);
    element.style.setProperty('--type-y', `${remaining * distance * .55}px`);
    element.style.setProperty('--type-scale', String(1 - remaining * .025));
  });
  const hero = document.querySelector('.hero');
  const p = clamp(window.scrollY / Math.max(1, hero.offsetHeight));
  document.querySelectorAll('.fragment').forEach((element, index) => {
    element.style.transform = `translate3d(${(index % 2 ? -1 : 1) * p * 12}px,${p * 5}px,0)`;
  });
}
function schedule() {
  if (!frame && !document.hidden) frame = requestAnimationFrame(render);
}
function setSceneActivity() {
  scenes.forEach((scene) => scene.classList.toggle('is-active',
    scene.dataset.inView === 'true' && !document.hidden && !motionPreference.matches));
}
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({target, isIntersecting}) => { target.dataset.inView = String(isIntersecting); });
    setSceneActivity();
  }, {threshold: 0});
  scenes.forEach((scene) => observer.observe(scene));
} else {
  scenes.forEach((scene) => { scene.dataset.inView = 'true'; });
}
function updatePreference() {
  document.body.classList.toggle('motion-enabled', !motionPreference.matches);
  if (motionPreference.matches) {
    moments.forEach((element) => {
      ['--type-x', '--type-y', '--type-scale'].forEach((name) => element.style.removeProperty(name));
    });
    document.querySelectorAll('.fragment').forEach((element) => element.style.removeProperty('transform'));
  }
  setSceneActivity();
  schedule();
}
window.addEventListener('scroll', schedule, {passive: true});
window.addEventListener('resize', schedule, {passive: true});
window.addEventListener('pageshow', schedule);
document.addEventListener('visibilitychange', () => { setSceneActivity(); schedule(); });
motionPreference.addEventListener('change', updatePreference);
updatePreference();
document.body.classList.add('is-ready');
