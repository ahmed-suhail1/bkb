document.documentElement.classList.add('js');

const header = document.querySelector('.site-header');
const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 80);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const revealItems = [...document.querySelectorAll('.reveal')];
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const menu = document.querySelector('.mobile-menu');
const menuButton = document.querySelector('.menu-toggle');
const closeButton = document.querySelector('.mobile-menu-top button');
const setMenu = (open) => {
  menu?.classList.toggle('open', open);
  menu?.setAttribute('aria-hidden', String(!open));
  menuButton?.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
};
menuButton?.addEventListener('click', () => setMenu(true));
closeButton?.addEventListener('click', () => setMenu(false));
menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

const divisionButtons = [...document.querySelectorAll('[data-division-index]')];
const divisionImages = [...document.querySelectorAll('.division-stage > img')];
const divisionDetail = document.querySelector('.division-detail');
const activateDivision = (button) => {
  const index = Number(button.dataset.divisionIndex);
  divisionButtons.forEach((item) => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-selected', String(active));
  });
  divisionImages.forEach((image, imageIndex) => {
    const active = imageIndex === index;
    image.classList.toggle('active', active);
    image.setAttribute('aria-hidden', String(!active));
  });
  if (!divisionDetail) return;
  divisionDetail.querySelector('p').textContent = button.dataset.kicker || '';
  divisionDetail.querySelector('h3').textContent = button.dataset.name || '';
  divisionDetail.querySelector(':scope > span').textContent = button.dataset.description || '';
  const services = (button.dataset.services || '').split('|').filter(Boolean);
  divisionDetail.querySelector('ul').innerHTML = services.map((service) => `<li>${service}</li>`).join('');
};
divisionButtons.forEach((button) => {
  button.addEventListener('click', () => activateDivision(button));
  button.addEventListener('mouseenter', () => activateDivision(button));
  button.addEventListener('focus', () => activateDivision(button));
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('[data-count]').forEach((number) => {
  const target = Number(number.dataset.count || 0);
  const suffix = number.dataset.suffix || '';
  const count = () => {
    if (number.dataset.counted === 'true') return;
    number.dataset.counted = 'true';
    if (reduceMotion) {
      number.textContent = `${target}${suffix}`;
      return;
    }
    const started = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - started) / 1100, 1);
      const value = Math.round(target * (1 - Math.pow(1 - progress, 3)));
      number.textContent = `${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        count();
        countObserver.disconnect();
      }
    }, { threshold: 0.55 });
    countObserver.observe(number);
  } else {
    count();
  }
});
