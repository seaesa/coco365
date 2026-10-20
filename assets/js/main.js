/* COCO365 – script dùng chung: header, menu di động, tìm kiếm, giỏ hàng, thẻ sản phẩm */
(function () {
  'use strict';
  const C = window.COCO;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').trim();
  const icon = (id, cls = 'ic') => `<svg class="${cls}"><use href="#i-${id}"/></svg>`;

  /* ---------- Bộ nhớ an toàn ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* bỏ qua */ } }
  };

  /* ---------- Giỏ hàng ---------- */
  const CART_KEY = 'coco365_cart';
  const cart = {
    items() { return store.get(CART_KEY, []).filter((i) => C.byId(i.id)); },
    save(items) { store.set(CART_KEY, items); cart.render(); document.dispatchEvent(new CustomEvent('cart:change')); },
    priceOf(item) {
      const p = C.byId(item.id);
      const s = p.sizes && p.sizes.find((x) => x.label === item.size);
      return s ? s.price : p.price;
    },
    add(id, qty = 1, size) {
      const p = C.byId(id); if (!p) return;
      if (!size && p.sizes) size = p.sizes[0].label;
      const items = cart.items();
      const found = items.find((i) => i.id === id && (i.size || '') === (size || ''));
      if (found) found.qty = Math.min(99, found.qty + qty); else items.push({ id, size: size || '', qty });
      cart.save(items);
      bump();
      toast(`<img src="${p.img}" alt=""><div><b>Đã thêm vào giỏ</b><small>${esc(p.name)}${size ? ' · ' + esc(size) : ''}</small></div><a href="${COCO.root}gio-hang/">Xem giỏ</a>`);
    },
    setQty(idx, qty) { const items = cart.items(); if (!items[idx]) return; items[idx].qty = Math.max(1, Math.min(99, qty)); cart.save(items); },
    remove(idx) { const items = cart.items(); items.splice(idx, 1); cart.save(items); },
    clear() { cart.save([]); },
    count() { return cart.items().reduce((s, i) => s + i.qty, 0); },
    subtotal() { return cart.items().reduce((s, i) => s + cart.priceOf(i) * i.qty, 0); },
    render() { const n = cart.count(); $$('[data-cart-count]').forEach((el) => { el.textContent = n > 99 ? '99+' : n; el.hidden = n === 0; }); }
  };
  function bump() { $$('[data-cart-count]').forEach((el) => { el.classList.remove('is-bump'); void el.offsetWidth; el.classList.add('is-bump'); }); }

  /* ---------- Toast ---------- */
  function toast(html, type = '') {
    const stack = $('.toast-stack'); if (!stack) return;
    const t = document.createElement('div');
    t.className = 'toast' + (type ? ' toast--' + type : '');
    t.innerHTML = html;
    stack.appendChild(t);
    setTimeout(() => { t.classList.add('is-out'); setTimeout(() => t.remove(), 300); }, 3200);
  }

  /* ---------- Thẻ sản phẩm ---------- */
  const stars = (r) => `<span class="stars" aria-label="${r} trên 5 sao">${[1, 2, 3, 4, 5].map((i) => `<svg style="opacity:${i <= Math.round(r) ? 1 : .25}"><use href="#i-star"/></svg>`).join('')}</span>`;
  const badgeClass = (b) => (b === 'Mới' ? ' badge--green' : b === 'Combo' || b === 'Đặc sản' ? ' badge--yellow' : '');
  const url = (p) => `${COCO.root}san-pham-chi-tiet/?id=${p.id}`;
  const priceLabel = (p) => (p.sizes ? `${C.fmt(p.sizes[0].price)}` : C.fmt(p.price));

  function productCard(p) {
    const cat = C.catById(p.cat);
    const alt = p.gallery && p.gallery[1];
    return `<article class="p-card reveal">
      ${p.badge ? `<span class="badge${badgeClass(p.badge)}">${esc(p.badge)}</span>` : ''}
      <div class="p-card__img">
        <img src="${p.img}" alt="${esc(p.name)}" loading="lazy" width="600" height="600">
        ${alt ? `<img class="p-card__alt" src="${alt}" alt="" loading="lazy" width="600" height="600">` : ''}
      </div>
      <div class="p-card__body">
        <span class="p-card__cat">${esc(cat ? cat.short : '')}</span>
        <h3><a href="${url(p)}">${esc(p.name)}</a></h3>
        <div class="p-card__meta">${icon('star')} ${p.rating.toFixed(1)} <span>·</span> Đã bán ${p.sold}</div>
        <div class="p-card__foot">
          <span class="price">${p.sizes ? '<small>Từ</small>' : ''}${priceLabel(p)}</span>
          <button class="add-btn" type="button" data-add="${p.id}" aria-label="Thêm ${esc(p.name)} vào giỏ">${icon('cart', '')}</button>
        </div>
      </div>
    </article>`;
  }

  function bestCard(p) {
    const unit = p.unit || (p.sizes ? p.sizes[0].label.replace('Ly ', '') : '');
    return `<article class="best-card reveal">
      <div class="best-card__img"><img src="${p.cut || p.img}" alt="${esc(p.name)}" loading="lazy"></div>
      <h3><a href="${url(p)}">${esc(p.name)}</a></h3>
      <p class="best-card__unit">${esc(unit)}</p>
      <div class="best-card__foot">
        <span class="price">${priceLabel(p)}</span>
        <button class="add-btn" type="button" data-add="${p.id}" aria-label="Thêm ${esc(p.name)} vào giỏ">${icon('cart', '')}</button>
      </div>
    </article>`;
  }

  function newsCard(n) {
    return `<article class="n-card reveal">
      <div class="n-card__img"><img src="${n.img}" alt="${esc(n.title)}" loading="lazy"></div>
      <div class="n-card__body">
        <div class="n-card__meta"><span class="tag">${esc(n.cat)}</span><span>${icon('calendar')} ${C.fmtDate(n.date)}</span></div>
        <h3><a href="${COCO.root}tin-tuc-chi-tiet/?id=${n.id}">${esc(n.title)}</a></h3>
        <p>${esc(n.excerpt)}</p>
        <span class="n-card__more">Đọc tiếp ${icon('arrow-right')}</span>
      </div>
    </article>`;
  }

  /* ---------- Header & menu ---------- */
  function initHeader() {
    const header = $('#header');
    const toTop = $('[data-to-top]');
    const onScroll = () => {
      const y = window.scrollY;
      header && header.classList.toggle('is-scrolled', y > 10);
      toTop && toTop.classList.toggle('is-visible', y > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    toTop && toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Menu di động
    const drawer = $('#drawer');
    const openBtn = $('[data-drawer-open]');
    const setDrawer = (open) => {
      drawer.classList.toggle('is-open', open);
      drawer.setAttribute('aria-hidden', String(!open));
      openBtn.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('is-locked', open);
      if (open) $('.drawer__nav a', drawer).focus(); else openBtn.focus();
    };
    openBtn && openBtn.addEventListener('click', () => setDrawer(true));
    $$('[data-drawer-close]').forEach((b) => b.addEventListener('click', () => setDrawer(false)));
    const activeSummary = $('.drawer__group summary.is-active');
    if (activeSummary) activeSummary.parentElement.open = true;

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (drawer && drawer.classList.contains('is-open')) setDrawer(false);
      if (!$('#search').hidden) closeSearch();
    });
  }

  /* ---------- Tìm kiếm ---------- */
  let lastFocus;
  function openSearch() {
    const s = $('#search'); lastFocus = document.activeElement;
    s.hidden = false; document.body.classList.add('is-locked');
    setTimeout(() => $('input', s).focus(), 30);
  }
  function closeSearch() {
    $('#search').hidden = true; document.body.classList.remove('is-locked');
    lastFocus && lastFocus.focus();
  }
  function searchProducts(q) {
    const k = norm(q); if (!k) return [];
    return C.products.filter((p) => norm(p.name + ' ' + (C.catById(p.cat) || {}).name + ' ' + p.short).includes(k));
  }
  function initSearch() {
    $$('[data-search-open]').forEach((b) => b.addEventListener('click', openSearch));
    $$('[data-search-close]').forEach((b) => b.addEventListener('click', closeSearch));
    const input = $('#search input'); const box = $('[data-search-results]');
    if (!input) return;
    input.addEventListener('input', () => {
      const q = input.value; const res = searchProducts(q).slice(0, 6);
      if (!q.trim()) { box.innerHTML = ''; return; }
      box.innerHTML = res.length
        ? res.map((p) => `<a href="${url(p)}"><img src="${p.img}" alt=""><span><b>${esc(p.name)}</b><small>${esc((C.catById(p.cat) || {}).name || '')}</small></span><span class="price">${priceLabel(p)}</span></a>`).join('')
        : `<p class="search__empty">Không tìm thấy món phù hợp với “${esc(q)}”. Thử “dừa”, “sen”, “matcha”…</p>`;
    });
  }

  /* ---------- Thêm vào giỏ (ủy quyền sự kiện) ---------- */
  function initAddButtons() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-add]'); if (!btn) return;
      e.preventDefault();
      cart.add(btn.dataset.add, 1);
      btn.classList.add('is-done'); btn.innerHTML = icon('check', '');
      setTimeout(() => { btn.classList.remove('is-done'); btn.innerHTML = icon('cart', ''); }, 1400);
    });
  }

  /* ---------- Đăng ký nhận tin ---------- */
  function initSubscribe() {
    $$('[data-subscribe]').forEach((f) => f.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = $('input[type=email]', f);
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
      f.classList.toggle('is-error', !ok);
      if (!ok) { toast('<div><b>Email chưa hợp lệ</b><small>Vui lòng kiểm tra lại địa chỉ email.</small></div>', 'error'); input.focus(); return; }
      const list = store.get('coco365_subscribers', []); list.push({ email: input.value.trim(), at: Date.now() }); store.set('coco365_subscribers', list);
      f.reset();
      toast('<div><b>Đăng ký thành công!</b><small>COCO365 sẽ gửi ưu đãi mới nhất tới bạn.</small></div>');
    }));
  }

  /* ---------- Hiệu ứng xuất hiện ---------- */
  let io;
  function reveal(root = document) {
    const els = $$('.reveal:not(.is-in)', root);
    if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
    io = io || new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    els.forEach((el, i) => { el.style.transitionDelay = `${(i % 5) * 60}ms`; io.observe(el); });
  }

  /* ---------- Đếm số liệu ---------- */
  function counters() {
    const els = $$('[data-count]');
    if (!els.length || !('IntersectionObserver' in window)) return;
    const ob = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target; const end = +el.dataset.count; const t0 = performance.now();
      const step = (t) => { const k = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))).toLocaleString('vi-VN'); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step); ob.unobserve(el);
    }), { threshold: .6 });
    els.forEach((c) => ob.observe(c));
  }

  const params = () => new URLSearchParams(location.search);

  window.App = { $, $$, esc, norm, icon, store, cart, toast, productCard, bestCard, newsCard, stars, reveal, params, url, priceLabel, searchProducts };

  document.addEventListener('DOMContentLoaded', () => {
    initHeader(); initSearch(); initAddButtons(); initSubscribe();
    cart.render(); reveal(); counters();
  });
})();
