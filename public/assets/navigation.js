(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const toggle = header.querySelector('.nav-toggle');
  const links = header.querySelector('#nav-links');
  const mobile = matchMedia('(max-width: 860px)');
  const ar = document.documentElement.lang === 'ar';
  const setOpen = open => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', ar ? (open ? 'إغلاق قائمة التنقل' : 'فتح قائمة التنقل') : (open ? 'Close navigation menu' : 'Open navigation menu'));
    header.classList.toggle('menu-open', open);
  };
  header.classList.add('nav-ready');
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  links.addEventListener('click', event => { if (event.target.closest('a')) setOpen(false); });
  document.addEventListener('click', event => { if (!header.contains(event.target)) setOpen(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.classList.contains('menu-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
  header.addEventListener('focusout', event => {
    if (!header.contains(event.relatedTarget)) setOpen(false);
  });
  mobile.addEventListener('change', () => {
    if (!mobile.matches && document.activeElement === toggle) header.querySelector('.home').focus();
    if (mobile.matches && links.contains(document.activeElement)) toggle.focus();
    setOpen(false);
  });
  const current = location.pathname.replace(/index\.html$/, '').replace(/\/$/, '');
  links.querySelectorAll('a').forEach(link => {
    if (new URL(link.href).pathname.replace(/\/$/, '') === current) link.setAttribute('aria-current', 'page');
  });
})();
