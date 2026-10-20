/* Trang tin tức & chi tiết bài viết */
document.addEventListener('DOMContentLoaded', () => {
  const { $, $$, esc, icon, newsCard, reveal, params, priceLabel, url } = window.App;
  const C = window.COCO;
  const sorted = C.news.slice().sort((a, b) => b.date.localeCompare(a.date));

  const sideLatest = (exclude) => sorted.filter((n) => n.id !== exclude).slice(0, 4)
    .map((n) => `<a href="${COCO.root}tin-tuc-chi-tiet/?id=${n.id}"><img src="${n.img}" alt="" loading="lazy"><span><b>${esc(n.title)}</b><small>${C.fmtDate(n.date)}</small></span></a>`).join('');
  const sideProducts = () => C.products.slice().sort((a, b) => b.sold - a.sold).slice(0, 4)
    .map((p) => `<a href="${url(p)}"><img src="${p.img}" alt="" loading="lazy"><span><b>${esc(p.name)}</b><small style="color:var(--green-800);font-weight:700">${priceLabel(p)}</small></span></a>`).join('');

  /* ---- Danh sách ---- */
  const listEl = $('[data-news-list]');
  if (listEl) {
    const cats = ['Tất cả'].concat([...new Set(sorted.map((n) => n.cat))]);
    let cur = 'Tất cả';
    const tabs = $('[data-news-tabs]');
    tabs.innerHTML = cats.map((c, i) => `<button class="tab" type="button" role="tab" aria-selected="${i === 0}" data-c="${esc(c)}">${esc(c)}</button>`).join('');
    const render = () => {
      const list = cur === 'Tất cả' ? sorted : sorted.filter((n) => n.cat === cur);
      listEl.innerHTML = list.map(newsCard).join('');
      reveal();
    };
    tabs.addEventListener('click', (e) => {
      const b = e.target.closest('[data-c]'); if (!b) return;
      cur = b.dataset.c;
      $$('[data-c]', tabs).forEach((x) => x.setAttribute('aria-selected', String(x === b)));
      render();
    });
    render();
    $('[data-news-latest]').innerHTML = sideLatest();
    $('[data-side-products]').innerHTML = sideProducts();
  }

  /* ---- Chi tiết ---- */
  const art = $('[data-article]');
  if (art) {
    const n = C.newsById(params().get('id')) || sorted[0];
    document.title = `${n.title} | COCO365`;
    const md = document.querySelector('meta[name=description]'); if (md) md.content = n.excerpt;
    $('[data-crumb]').textContent = n.title;
    const block = ([type, a, b]) => {
      if (type === 'p') return `<p>${a}</p>`;
      if (type === 'h2') return `<h2>${esc(a)}</h2>`;
      if (type === 'ul') return `<ul>${a.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
      if (type === 'ol') return `<ol>${a.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>`;
      if (type === 'quote') return `<blockquote>${esc(a)}</blockquote>`;
      if (type === 'img') return `<figure><img src="${a}" alt="${esc(b)}" loading="lazy"><figcaption>${esc(b)}</figcaption></figure>`;
      return '';
    };
    const shareUrl = encodeURIComponent(location.href);
    art.innerHTML = `
      <div class="n-card__meta"><span class="tag">${esc(n.cat)}</span><span>${icon('calendar')} ${C.fmtDate(n.date)}</span><span>· COCO365</span></div>
      <h1>${esc(n.title)}</h1>
      <div class="article__cover"><img src="${n.img}" alt="${esc(n.title)}"></div>
      <div class="prose">${n.body.map(block).join('')}</div>
      <div class="share">Chia sẻ:
        <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" target="_blank" rel="noopener" aria-label="Chia sẻ Facebook">${icon('fb', '')}</a>
        <a href="https://zalo.me/share?url=${shareUrl}" target="_blank" rel="noopener" aria-label="Chia sẻ Zalo">${icon('zalo', '')}</a>
        <button type="button" aria-label="Sao chép liên kết" data-copy>${icon('send', '')}</button>
      </div>`;
    $('[data-copy]').addEventListener('click', () => {
      (navigator.clipboard ? navigator.clipboard.writeText(location.href) : Promise.reject()).then(
        () => window.App.toast('<div><b>Đã sao chép liên kết</b></div>'),
        () => window.App.toast('<div><b>Không sao chép được</b><small>Hãy sao chép từ thanh địa chỉ.</small></div>', 'error'));
    });
    $('[data-news-latest]').innerHTML = sideLatest(n.id);
    $('[data-side-products]').innerHTML = sideProducts();
    $('[data-related-news]').innerHTML = sorted.filter((x) => x.id !== n.id).slice(0, 3).map(newsCard).join('');
    reveal();
  }
});
