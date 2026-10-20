/* Tra cứu đơn hàng (lưu trên trình duyệt) */
document.addEventListener('DOMContentLoaded', () => {
  const { $, esc, norm, store, icon } = window.App;
  const C = window.COCO;
  const box = $('[data-orders]');
  const all = store.get('coco365_orders', []);

  const render = (list, title) => {
    $('[data-orders-title]').textContent = title;
    box.innerHTML = list.length ? list.map((o) => `<article class="order">
      <div class="order__head"><span>Mã đơn <b>${esc(o.code)}</b> · ${new Date(o.at).toLocaleString('vi-VN')}</span><span class="order__status">${esc(o.status)}</span></div>
      <ul>${o.items.map((i) => `<li>${esc(i.name)}${i.size ? ' (' + esc(i.size) + ')' : ''} × ${i.qty} — ${C.fmt(i.price * i.qty)}</li>`).join('')}</ul>
      <p style="font-size:13.5px;color:var(--muted);margin-top:8px">${icon('pin')} ${esc(o.customer.name)} · ${esc(o.customer.phone)} · ${esc(o.customer.address)}</p>
      <div class="order__total"><span>Tổng cộng</span><span style="color:var(--red)">${C.fmt(o.total)}</span></div>
    </article>`).join('')
      : `<div class="empty">${icon('box', '')}<b>Chưa có đơn hàng nào</b>Hãy chọn món tại <a href="${COCO.root}san-pham/" style="color:var(--green-800);font-weight:600">Thực đơn</a> nhé!</div>`;
  };
  render(all, `Đơn hàng của bạn (${all.length})`);

  $('[data-lookup]').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = norm(e.target.elements.q.value).replace(/[\s.]/g, '');
    if (!q) { render(all, `Đơn hàng của bạn (${all.length})`); return; }
    const res = all.filter((o) => norm(o.code) === q || o.customer.phone.replace(/[\s.]/g, '').includes(q));
    render(res, `Kết quả tìm kiếm (${res.length})`);
  });
});
