/* Trang liên hệ: kiểm tra form, lưu tạm và mở Zalo kèm nội dung đã sao chép */
document.addEventListener('DOMContentLoaded', () => {
  const { $, store, toast } = window.App;
  const S = window.COCO.store;
  const form = $('[data-contact]');
  const rules = {
    name: (v) => v.trim().length >= 2,
    phone: (v) => /^(0|\+84)(\d[\s.]?){8,10}$/.test(v.trim()),
    message: (v) => v.trim().length >= 5
  };
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let bad = null;
    Object.entries(rules).forEach(([n, ok]) => {
      const el = form.elements[n]; const invalid = !ok(el.value);
      el.closest('.field').classList.toggle('is-invalid', invalid);
      if (invalid && !bad) bad = el;
    });
    if (bad) { bad.focus(); return; }
    const d = Object.fromEntries(new FormData(form).entries());
    const list = store.get('coco365_messages', []); list.unshift({ ...d, at: Date.now() }); store.set('coco365_messages', list);
    const text = `[${d.topic}] ${d.name} – ${d.phone}\n${d.message}`;
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
    form.reset();
    toast(`<div><b>Đã ghi nhận lời nhắn!</b><small>Nội dung đã được sao chép – dán vào Zalo để gửi cho COCO365.</small></div><a href="${S.zalo}" target="_blank" rel="noopener">Mở Zalo</a>`);
  });
});
