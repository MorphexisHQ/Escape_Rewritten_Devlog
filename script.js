(() => {
  const header = document.querySelector('.site-header');
  const mobile = document.querySelector('.mobile-nav');
  const links = [...document.querySelectorAll('.desktop-nav a, .mobile-nav nav a')];
  const sections = [...document.querySelectorAll('[data-nav]')];
  let pending = false;
  const update = () => {
    pending = false;
    const headerHeight = header.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--header-height', `${Math.ceil(headerHeight)}px`);
    const y = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    document.documentElement.style.setProperty('--reading', total > 0 ? Math.min(1, y / total) : 0);
    let current = '';
    const cutoff = headerHeight + 70;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= cutoff) current = section.dataset.nav;
    }
    // A short last section can be fully visible before its top reaches the
    // reading line. Browser scroll clamping must not leave the prior tab active.
    if (total > 0 && y >= total - 2 && sections.length) {
      current = sections[sections.length - 1].dataset.nav;
    }
    for (const link of links) {
      const active = link.hash === `#${current}`;
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };
  const queue = () => {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  };
  for (const link of mobile.querySelectorAll('nav a')) link.addEventListener('click', () => { mobile.open = false; });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && mobile.open) { mobile.open = false; mobile.querySelector('summary').focus(); } });
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
  window.addEventListener('hashchange', queue);
  update();
})();
