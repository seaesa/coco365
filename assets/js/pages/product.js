/* Trang chi tiết sản phẩm */
document.addEventListener('DOMContentLoaded', () => {
  const { $, $$, esc, icon, stars, productCard, reveal, params, cart, store, toast } = window.App;
  const C = window.COCO;
  const p = C.byId(params().get('id')) || C.products[0];
  const cat = C.catById(p.cat);
  let size = p.sizes ? p.sizes[0] : null;

  document.title = `${p.name} | COCO365`;
  const metaDesc = document.querySelector('meta[name=description]');
  if (metaDesc) metaDesc.content = `${p.name} – ${p.short}. ${p.intro}`.slice(0, 160);

  // Breadcrumb
  $('[data-crumbs]').insertAdjacentHTML('beforeend',
    `${icon('chevron-right')}<a href="${COCO.root}san-pham/?cat=${cat.id}">${esc(cat.name)}</a>${icon('chevron-right')}<span aria-current="page">${esc(p.name)}</span>`);

  // Thư viện ảnh
  const main = $('[data-main]');
  const gallery = p.gallery && p.gallery.length ? p.gallery : [p.img];
  const thumbs = $('[data-thumbs]');
  thumbs.innerHTML = gallery.map((src, i) => `<button type="button" role="listitem" aria-label="Ảnh ${i + 1}" aria-current="${i === 0}" data-src="${src}"><img src="${src}" alt=""></button>`).join('');
  const setMain = (src) => { main.src = src; main.alt = p.name; };
  setMain(gallery[0]);
  thumbs.addEventListener('click', (e) => {
    const b = e.target.closest('[data-src]'); if (!b) return;
    $$('button', thumbs).forEach((x) => x.setAttribute('aria-current', String(x === b)));
    setMain(b.dataset.src);
  });
  if (gallery.length < 2) thumbs.hidden = true;

  // Thông tin
  $('[data-cat]').textContent = cat.name; $('[data-cat]').href = `${COCO.root}san-pham/?cat=${cat.id}`;
  $('[data-name]').textContent = p.name;
  $('[data-rating]').innerHTML = `${stars(p.rating)} <b style="color:var(--ink)">${p.rating.toFixed(1)}</b> <span>(${p.reviews} đánh giá)</span> <span>·</span> <span>Đã bán ${p.sold}</span>`;
  $('[data-short]').textContent = p.short;
  $('[data-intro]').textContent = p.intro;
  const priceEl = $('[data-price]'); const unitEl = $('[data-unit]');
  const updatePrice = () => {
    priceEl.textContent = C.fmt(size ? size.price : p.price);
    unitEl.textContent = size ? '/ ' + size.label : (p.unit ? '/ ' + p.unit : '');
    if (size) $('[data-size-label]').textContent = size.label;
  };

  if (p.sizes) {
    $('[data-sizes-wrap]').hidden = false;
    const wrap = $('[data-sizes]');
    wrap.innerHTML = p.sizes.map((s, i) => `<button class="size" type="button" role="radio" aria-checked="${i === 0}" data-size="${i}">${esc(s.label)}<small>${C.fmt(s.price)}</small></button>`).join('');
    wrap.addEventListener('click', (e) => {
      const b = e.target.closest('[data-size]'); if (!b) return;
      size = p.sizes[+b.dataset.size];
      $$('[data-size]', wrap).forEach((x) => x.setAttribute('aria-checked', String(x === b)));
      updatePrice();
    });
  }
  updatePrice();

  // Số lượng
  const qtyInput = $('[data-qty-input]');
  const clampQty = () => { qtyInput.value = Math.max(1, Math.min(99, parseInt(qtyInput.value, 10) || 1)); };
  $$('[data-qty]').forEach((b) => b.addEventListener('click', () => { qtyInput.value = (+qtyInput.value || 1) + +b.dataset.qty; clampQty(); }));
  qtyInput.addEventListener('change', clampQty);

  $('[data-add-detail]').addEventListener('click', () => cart.add(p.id, +qtyInput.value, size && size.label));
  $('[data-buy-now]').addEventListener('click', () => { cart.add(p.id, +qtyInput.value, size && size.label); location.href = COCO.root + 'gio-hang/#thanh-toan'; });

  // Tabs mô tả
  $('[data-desc]').innerHTML = `<h2 style="margin-top:0">${esc(p.name)}</h2>
    <p><em>${esc(p.short)}</em></p><p>${esc(p.intro)}</p>
    <ul>${p.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    <p>💧 Mỗi ngụm là một trải nghiệm mát lành, nhẹ nhàng mà cơ thể bạn xứng đáng được yêu chiều!</p>`;
  $('[data-store]').innerHTML = `<h3 style="margin-top:0">Bảo quản</h3><p>${esc(p.storage)}</p>
    <h3>Gợi ý thưởng thức</h3><ul><li>Ngon nhất khi dùng lạnh, ngay trong ngày nhận hàng.</li><li>Lắc nhẹ trước khi uống để topping hòa quyện.</li><li>Không để sản phẩm dưới nắng trực tiếp hoặc trong xe nóng.</li></ul>
    <h3>Giao hàng</h3><p>Giao nhanh nội thành Vinh trong 30–60 phút. Sản phẩm được đóng gói kín, kèm đá giữ lạnh. Xem thêm <a href="${COCO.root}chinh-sach/#van-chuyen">chính sách vận chuyển</a>.</p>`;
  const tabs = $$('.ptabs__nav [role=tab]');
  tabs.forEach((t) => t.addEventListener('click', () => {
    tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', String(on)); $('#' + x.getAttribute('aria-controls')).hidden = !on; });
  }));

  // Đánh giá (lưu trên trình duyệt)
  const RKEY = 'coco365_reviews_' + p.id;
  const renderReviews = () => {
    const list = store.get(RKEY, []);
    $('[data-review-count]').textContent = `(${p.reviews + list.length})`;
    $('[data-review-summary]').innerHTML = `<b>${p.rating.toFixed(1)}</b><div>${stars(p.rating)}<p style="color:var(--muted);font-size:14px">${p.reviews + list.length} lượt đánh giá</p></div>`;
    $('[data-review-list]').innerHTML = list.length
      ? list.map((r) => `<div style="padding:14px 0;border-bottom:1px solid var(--line)"><b>${esc(r.name)}</b> ${stars(r.rate)}<p style="color:var(--ink-2);margin-top:6px">${esc(r.text)}</p><small style="color:var(--muted)">${new Date(r.at).toLocaleDateString('vi-VN')}</small></div>`).join('')
      : '<p style="color:var(--muted)">Hãy là người đầu tiên chia sẻ cảm nhận về món này!</p>';
  };
  renderReviews();
  $('[data-review-form]').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target; let ok = true;
    ['name', 'text'].forEach((n) => { const el = f.elements[n]; const bad = !el.value.trim(); el.closest('.field').classList.toggle('is-invalid', bad); if (bad) ok = false; });
    if (!ok) return;
    const list = store.get(RKEY, []);
    list.unshift({ name: f.elements.name.value.trim(), text: f.elements.text.value.trim(), rate: +f.elements.rate.value, at: Date.now() });
    store.set(RKEY, list); f.reset(); renderReviews();
    toast('<div><b>Cảm ơn bạn đã đánh giá!</b><small>Nhận xét của bạn đã được ghi nhận.</small></div>');
  });

  // Sản phẩm liên quan
  const related = C.products.filter((x) => x.id !== p.id && x.cat === p.cat)
    .concat(C.products.filter((x) => x.id !== p.id && x.cat !== p.cat).sort((a, b) => b.sold - a.sold)).slice(0, 4);
  $('[data-related]').innerHTML = related.map(productCard).join('');
  reveal();
});
