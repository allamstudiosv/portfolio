(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || !('IntersectionObserver' in window)) return;
  // Content stays visible without JS; animate only as each element enters view.
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (!motion.matches) entry.target.classList.add('reveal-enter');
      observer.unobserve(entry.target);
    });
  }, {threshold:0.08});
  document.querySelectorAll('.video,.review-card,.split>div,main form,#reviews-title,.hero-content').forEach(el => observer.observe(el));
  motion.addEventListener('change', () => {
    if (motion.matches) {
      observer.disconnect();
      document.querySelectorAll('.reveal-enter').forEach(el => el.classList.remove('reveal-enter'));
    }
  });
})();
