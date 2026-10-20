/* Trang danh sách sản phẩm: lọc theo danh mục, giá, tìm kiếm, sắp xếp */
document.addEventListener('DOMContentLoaded', () => {
  const { $, $$, esc, norm, icon, productCard, reveal, params } = window.App;
  const C = window.COCO;
  const p = params();
  const state = {
    cat: C.catById(p.get('cat')) ? p.get('cat') : 'all',
    q: p.get('q') || '',
    price: 'all',
    sort: ['popular', 'best', 'rating', 'price-asc', 'price-desc', 'name'].includes(p.get('sort')) ? p.get('sort') : 'popular'
  };

  const catsEl = $('[data-cats]');
  const grid = $('[data-grid]');
  const qInput = $('[data-q]');
  const sortEl = $('[data-sort]');
  qInput.value = state.q;
  sortEl.value = state.sort;

  const count = (id) => (id === 'all' ? C.products.length : C.products.filter((x) => x.cat === id).length);
  catsEl.innerHTML = [{ id: 'all', name: 'Tất cả sản phẩm' }].concat(C.categories)
    .map((c) => `<button type="button" data-cat="${c.id}">${esc(c.name)}<small>${count(c.id)}</small></button>`).join('');

  const basePrice = (x) => (x.sizes ? x.sizes[0].price : x.price);

  function syncUrl() {
    const u = new URLSearchParams();
    if (state.cat !== 'all') u.set('cat', state.cat);
    if (state.q) u.set('q', state.q);
    if (state.sort !== 'popular') u.set('sort', state.sort);
    history.replaceState(null, '', location.pathname + (u.toString() ? '?' + u : ''));
  }

  function render() {
    let list = C.products.slice();
    if (state.cat !== 'all') list = list.filter((x) => x.cat === state.cat);
    if (state.q.trim()) {
      const k = norm(state.q);
      list = list.filter((x) => norm(x.name + ' ' + x.short + ' ' + (C.catById(x.cat) || {}).name).includes(k));
    }
    if (state.price !== 'all') {
      const [lo, hi] = state.price.split('-').map(Number);
      list = list.filter((x) => basePrice(x) >= lo && basePrice(x) < hi);
    }
    const sorters = {
      popular: (a, b) => b.sold * b.rating - a.sold * a.rating,
      best: (a, b) => b.sold - a.sold,
      rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
      'price-asc': (a, b) => basePrice(a) - basePrice(b),
      'price-desc': (a, b) => basePrice(b) - basePrice(a),
      name: (a, b) => a.name.localeCompare(b.name, 'vi')
    };
    list.sort(sorters[state.sort]);

    // Tiêu đề & breadcrumb theo danh mục
    const cat = C.catById(state.cat);
    $('[data-title]').textContent = cat ? cat.name : 'Thực đơn COCO365';
    $('[data-desc]').textContent = cat ? cat.desc : 'Hơn 15 món từ dừa xiêm tươi – làm mới mỗi ngày, 100% nguyên liệu tự nhiên, không chất bảo quản.';
    $('[data-crumb]').textContent = cat ? cat.name : 'Sản phẩm';
    document.title = (cat ? cat.name : 'Thực đơn sản phẩm') + ' | COCO365';

    $$('[data-cat]', catsEl).forEach((b) => {
      const on = b.dataset.cat === state.cat;
      b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on));
    });

    // Bộ lọc đang áp dụng
    const chips = [];
    if (cat) chips.push(['cat', cat.name]);
    if (state.q) chips.push(['q', `“${state.q}”`]);
    if (state.price !== 'all') chips.push(['price', $(`input[name=price][value="${state.price}"]`).parentElement.textContent.trim()]);
    $('[data-chips]').innerHTML = chips.map(([k, v]) => `<span class="chip">${esc(v)}<button type="button" aria-label="Bỏ lọc ${esc(v)}" data-clear="${k}">${icon('close', '')}</button></span>`).join('')
      + (chips.length > 1 ? `<button class="link-btn" type="button" data-clear="all">Xóa tất cả</button>` : '');

    $('[data-result-count]').textContent = list.length;
    grid.innerHTML = list.length ? list.map(productCard).join('')
      : `<div class="empty">${icon('search', '')}<b>Chưa tìm thấy món phù hợp</b>Thử từ khóa khác hoặc <button class="link-btn" style="color:var(--green-800);font-weight:600" type="button" data-clear="all">xem toàn bộ thực đơn</button>.</div>`;
    reveal(grid);
    syncUrl();
  }

  catsEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]'); if (!b) return;
    state.cat = b.dataset.cat; render(); closeFilters();
  });
  $$('input[name=price]').forEach((r) => r.addEventListener('change', () => { state.price = r.value; render(); }));
  let t; qInput.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { state.q = qInput.value.trim(); render(); }, 200); });
  sortEl.addEventListener('change', () => { state.sort = sortEl.value; render(); });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-clear]'); if (!b) return;
    const k = b.dataset.clear;
    if (k === 'cat' || k === 'all') state.cat = 'all';
    if (k === 'q' || k === 'all') { state.q = ''; qInput.value = ''; }
    if (k === 'price' || k === 'all') { state.price = 'all'; $('input[name=price][value=all]').checked = true; }
    render();
  });

  // Bộ lọc dạng ngăn kéo trên di động
  const filters = $('#filters'); const backdrop = $('.filters-backdrop');
  function closeFilters() { filters.classList.remove('is-open'); backdrop.hidden = true; document.body.classList.remove('is-locked'); }
  $('[data-filters-open]').addEventListener('click', () => { filters.classList.add('is-open'); backdrop.hidden = false; document.body.classList.add('is-locked'); });
  $$('[data-filters-close]').forEach((b) => b.addEventListener('click', closeFilters));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeFilters(); });

  render();
});
