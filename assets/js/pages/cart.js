/* Trang giỏ hàng & thanh toán */
document.addEventListener('DOMContentLoaded', () => {
  const { $, $$, esc, icon, productCard, reveal, cart, toast } = window.App;
  const C = window.COCO;
  const S = C.store;
  let coupon = null;

  const listEl = $('[data-cart-list]');
  const wrap = $('[data-cart-wrap]');
  const empty = $('[data-cart-empty]');
  const done = $('[data-cart-done]');

  function totals() {
    const sub = cart.subtotal();
    const ship = sub === 0 || sub >= S.freeShip ? 0 : S.shipFee;
    const discount = coupon ? Math.round(sub * coupon.percent / 100) : 0;
    return { sub, ship, discount, total: sub + ship - discount };
  }

  function render() {
    const items = cart.items();
    if (!done.hidden) return;
    empty.hidden = items.length > 0;
    wrap.hidden = items.length === 0;
    if (!items.length) return;

    listEl.innerHTML = items.map((it, idx) => {
      const p = C.byId(it.id); const price = cart.priceOf(it);
      return `<div class="cart-item">
        <a href="${COCO.root}san-pham-chi-tiet/?id=${p.id}"><img src="${p.img}" alt="${esc(p.name)}"></a>
        <div>
          <h3><a href="${COCO.root}san-pham-chi-tiet/?id=${p.id}">${esc(p.name)}</a></h3>
          <p class="cart-item__opt">${it.size ? esc(it.size) + ' · ' : ''}${C.fmt(price)}</p>
          <div class="cart-item__row">
            <div class="qty qty--sm">
              <button type="button" aria-label="Giảm" data-dec="${idx}"><svg><use href="#i-minus"/></svg></button>
              <input type="number" min="1" max="99" value="${it.qty}" aria-label="Số lượng ${esc(p.name)}" data-qty="${idx}">
              <button type="button" aria-label="Tăng" data-inc="${idx}"><svg><use href="#i-plus"/></svg></button>
            </div>
            <button class="link-btn" type="button" data-remove="${idx}">${icon('trash', '')}Xóa</button>
          </div>
        </div>
        <p class="cart-item__price">${C.fmt(price * it.qty)}</p>
      </div>`;
    }).join('');

    const t = totals();
    $('[data-sum-count]').textContent = cart.count();
    $('[data-sum-sub]').textContent = C.fmt(t.sub);
    $('[data-sum-ship]').textContent = t.ship ? C.fmt(t.ship) : 'Miễn phí';
    $('[data-sum-discount-row]').hidden = !t.discount;
    $('[data-sum-discount]').textContent = '−' + C.fmt(t.discount);
    $('[data-sum-total]').textContent = C.fmt(t.total);
    const left = S.freeShip - t.sub;
    $('[data-ship]').innerHTML = (left > 0
      ? `Mua thêm <b>${C.fmt(left)}</b> để được <b>miễn phí giao hàng</b>`
      : `${icon('check')} Đơn của bạn được <b>miễn phí giao hàng</b>`)
      + `<div class="ship-progress__bar"><i style="width:${Math.min(100, t.sub / S.freeShip * 100)}%"></i></div>`;
  }

  listEl.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const items = cart.items();
    if (b.dataset.inc) cart.setQty(+b.dataset.inc, items[+b.dataset.inc].qty + 1);
    if (b.dataset.dec) cart.setQty(+b.dataset.dec, items[+b.dataset.dec].qty - 1);
    if (b.dataset.remove) { cart.remove(+b.dataset.remove); toast('<div><b>Đã xóa khỏi giỏ hàng</b></div>'); }
  });
  listEl.addEventListener('change', (e) => { if (e.target.dataset.qty) cart.setQty(+e.target.dataset.qty, parseInt(e.target.value, 10) || 1); });
  $('[data-cart-clear]').addEventListener('click', () => { cart.clear(); });
  document.addEventListener('cart:change', render);

  $('[data-coupon-apply]').addEventListener('click', () => {
    const code = $('[data-coupon]').value.trim().toUpperCase();
    const c = S.coupons && S.coupons[code];
    if (c) { coupon = c; toast(`<div><b>Đã áp dụng mã ${esc(code)}</b><small>${esc(c.label)}</small></div>`); }
    else { coupon = null; toast('<div><b>Mã giảm giá không hợp lệ</b><small>Vui lòng kiểm tra lại mã.</small></div>', 'error'); }
    render();
  });

  // Đặt hàng
  const form = $('[data-checkout]');
  const rules = {
    name: (v) => v.trim().length >= 2,
    phone: (v) => /^(0|\+84)(\d[\s.]?){8,10}$/.test(v.trim()),
    address: (v) => v.trim().length >= 5
  };
  Object.keys(rules).forEach((n) => form.elements[n].addEventListener('input', (e) => {
    const f = e.target.closest('.field'); if (f.classList.contains('is-invalid')) f.classList.toggle('is-invalid', !rules[n](e.target.value));
  }));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let firstBad = null;
    Object.entries(rules).forEach(([n, ok]) => {
      const el = form.elements[n]; const bad = !ok(el.value);
      el.closest('.field').classList.toggle('is-invalid', bad);
      if (bad && !firstBad) firstBad = el;
    });
    if (firstBad) { firstBad.focus(); toast('<div><b>Vui lòng kiểm tra lại thông tin</b><small>Các ô có dấu * là bắt buộc.</small></div>', 'error'); return; }

    const t = totals();
    const items = cart.items().map((it) => ({ ...it, name: C.byId(it.id).name, price: cart.priceOf(it) }));
    const code = 'CC' + Date.now().toString().slice(-7);
    const fd = Object.fromEntries(new FormData(form).entries());

    const text = [
      `ĐƠN HÀNG ${code} – COCO365`,
      ...items.map((i) => `• ${i.name}${i.size ? ' (' + i.size + ')' : ''} x${i.qty} = ${C.fmt(i.price * i.qty)}`),
      `Tạm tính: ${C.fmt(t.sub)} | Ship: ${t.ship ? C.fmt(t.ship) : 'Miễn phí'}${t.discount ? ' | Giảm: −' + C.fmt(t.discount) : ''}`,
      `TỔNG: ${C.fmt(t.total)}`,
      `Người nhận: ${fd.name} – ${fd.phone}`,
      `Địa chỉ: ${fd.address}`,
      `Thời gian: ${fd.time} | Thanh toán: ${fd.pay === 'bank' ? 'Chuyển khoản' : 'COD'}`,
      fd.note ? `Ghi chú: ${fd.note}` : ''
    ].filter(Boolean).join('\n');

    const copy = () => (navigator.clipboard ? navigator.clipboard.writeText(text).catch(() => {}) : Promise.resolve());
    copy();
    cart.clear();
    done.hidden = false; wrap.hidden = true; empty.hidden = true;
    $('[data-done-name]').textContent = fd.name;
    $('[data-done-code]').textContent = 'Mã đơn: ' + code;
    $('[data-send-zalo]').addEventListener('click', () => { copy(); toast('<div><b>Đã sao chép nội dung đơn</b><small>Dán vào khung chat Zalo và gửi cho COCO365.</small></div>'); window.open(S.zalo, '_blank', 'noopener'); });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Gợi ý
  $('[data-suggest]').innerHTML = C.products.slice().sort((a, b) => b.sold - a.sold).slice(0, 4).map(productCard).join('');
  render();
  reveal();
  if (location.hash === '#thanh-toan' && !wrap.hidden) setTimeout(() => form.scrollIntoView({ behavior: 'smooth' }), 300);
});
