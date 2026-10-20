/* Trang chính sách: tô sáng mục lục theo phần đang xem */
document.addEventListener('DOMContentLoaded', () => {
  const { $$ } = window.App;
  const links = $$('[data-toc] a');
  const secs = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (!en.isIntersecting) return;
    links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-30% 0px -60% 0px' });
  secs.forEach((s) => io.observe(s));
});
