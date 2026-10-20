/* Trang chủ */
document.addEventListener('DOMContentLoaded', () => {
  const { $, $$, esc, productCard, bestCard, newsCard, reveal } = window.App;
  const C = window.COCO;

  /* Hero: luân phiên các ly nước */
  const cups = $$('[data-hero-cups] img');
  const dots = $('[data-hero-dots]');
  const label = $('[data-hero-label]');
  const nameEl = $('[data-hero-name]');
  let cur = 0; let timer;
  const show = (i) => {
    cups[cur].classList.remove('is-active');
    dots.children[cur].setAttribute('aria-selected', 'false');
    cur = (i + cups.length) % cups.length;
    cups[cur].classList.add('is-active');
    dots.children[cur].setAttribute('aria-selected', 'true');
    nameEl.textContent = cups[cur].dataset.name;
    label.href = cups[cur].dataset.href;
  };
  if (cups.length && dots) {
    dots.innerHTML = cups.map((c, i) => `<button type="button" role="tab" aria-label="${esc(c.dataset.name)}" aria-selected="${i === 0}"></button>`).join('');
    const auto = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    const restart = () => { clearInterval(timer); if (auto) timer = setInterval(() => show(cur + 1), 4200); };
    $$('button', dots).forEach((b, i) => b.addEventListener('click', () => { show(i); restart(); }));
    $('[data-hero-prev]').addEventListener('click', () => { show(cur - 1); restart(); });
    $('[data-hero-next]').addEventListener('click', () => { show(cur + 1); restart(); });
    // Tạm dừng khi rê chuột vào banner
    const hero = $('.hero');
    hero.addEventListener('mouseenter', () => clearInterval(timer));
    hero.addEventListener('mouseleave', restart);
    // Vuốt trái/phải trên điện thoại
    let x0 = null;
    hero.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) { show(cur + (dx < 0 ? 1 : -1)); restart(); }
    });
    restart();
  }

  /* Sản phẩm bán chạy */
  const bestIds = ['sua-dua-non-tran-chau', 'coco-sen-dua-long-nhan', 'bo-gia-dua-non', 'coco-matcha-sen-dua', 'dua-nuong-nguyen-qua'];
  $('[data-best-grid]').innerHTML = bestIds.map((id) => bestCard(C.byId(id))).join('');

  /* Thực đơn theo danh mục */
  const tabsEl = $('[data-menu-tabs]');
  const grid = $('[data-menu-grid]');
  const tabs = [{ id: 'all', name: 'Tất cả' }].concat(C.categories.map((c) => ({ id: c.id, name: c.short })));
  tabsEl.innerHTML = tabs.map((t, i) => `<button class="tab" type="button" role="tab" aria-selected="${i === 0}" data-tab="${t.id}">${esc(t.name)}</button>`).join('');
  const renderMenu = (cat) => {
    const list = cat === 'all' ? C.products.slice().sort((a, b) => b.sold - a.sold).slice(0, 8) : C.products.filter((p) => p.cat === cat);
    grid.innerHTML = list.map(productCard).join('');
    reveal(grid);
  };
  tabsEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tab]'); if (!b) return;
    $$('[data-tab]', tabsEl).forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    renderMenu(b.dataset.tab);
  });
  renderMenu('all');

  /* Tin tức */
  $('[data-news-grid]').innerHTML = C.news.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3).map(newsCard).join('');

  reveal();
});
