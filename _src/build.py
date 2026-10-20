#!/usr/bin/env python3
"""Ghép header/footer dùng chung vào từng trang -> xuất HTML tĩnh ra thư mục gốc.

Chạy:  python3 _src/build.py
Mỗi file trong _src/pages/*.html có phần đầu dạng:
---
title: Tiêu đề trang
description: Mô tả SEO
nav: home|products|about|news|contact
script: home            (tùy chọn -> nạp assets/js/pages/home.js)
---
"""
import pathlib, re, html

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / '_src'
PARTS = SRC / 'partials'
SITE = 'COCO365 – Giọt lành mỗi ngày'
VERSION = '1.0.0'


def read(p):
    return (PARTS / p).read_text(encoding='utf-8')


def parse(text):
    m = re.match(r'---\n(.*?)\n---\n', text, re.S)
    meta = {}
    for line in m.group(1).splitlines():
        k, _, v = line.partition(':')
        meta[k.strip()] = v.strip()
    return meta, text[m.end():]


def build(page):
    meta, body = parse(page.read_text(encoding='utf-8'))
    title = meta.get('title') or SITE
    full_title = title if title == SITE else f'{title} | COCO365'
    desc = meta.get('description', 'COCO365 – nước dừa xiêm, dừa nướng, sữa dừa non, kem dừa tươi ngon tại Vinh, Nghệ An.')
    nav = meta.get('nav', '')
    prefix = {'index': '', '404': '/'}.get(page.stem, '../')
    header = read('header.html')
    if nav:
        header = header.replace(f'data-nav="{nav}"', f'data-nav="{nav}" class="is-active" aria-current="page"')
    script = meta.get('script')
    page_js = f'\n  <script src="assets/js/pages/{script}.js?v={VERSION}" defer></script>' if script else ''
    out = f'''<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(full_title)}</title>
  <meta name="description" content="{html.escape(desc)}">
  <meta name="theme-color" content="#135c2f">
  <meta property="og:type" content="website">
  <meta property="og:title" content="{html.escape(full_title)}">
  <meta property="og:description" content="{html.escape(desc)}">
  <meta property="og:image" content="assets/img/banners/bat-mood-tuoi.webp">
  <link rel="icon" type="image/png" href="assets/img/brand/favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Dancing+Script:wght@600;700&family=Lobster&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css?v={VERSION}">
  <script src="assets/js/data.js?v={VERSION}" defer></script>
  <script src="assets/js/main.js?v={VERSION}" defer></script>{page_js}
</head>
<body data-page="{page.stem}" data-root="{prefix}">
{read('icons.html')}
{header}
{body.strip()}
{read('footer.html')}
</body>
</html>
'''
    # Trang chủ -> /index.html, 404 -> /404.html (dùng đường dẫn tuyệt đối),
    # các trang khác -> /<ten-trang>/index.html để URL không có đuôi .html
    if prefix:
        out = re.sub(r'((?:href|src|action)=")(?!https?:|#|/|mailto:|tel:|data:|javascript:)', r'\g<1>' + prefix, out)
        out = out.replace('content="assets/', f'content="{prefix}assets/')
        out = out.replace(f'="{prefix}./"', f'="{prefix}"')
    dest = ROOT / ('index.html' if page.stem in ('index', '404') else f'{page.stem}/index.html')
    if page.stem == '404':
        dest = ROOT / '404.html'
    dest.parent.mkdir(exist_ok=True)
    dest.write_text(out, encoding='utf-8')
    return str(dest.relative_to(ROOT))


if __name__ == '__main__':
    # xóa bản build kiểu cũ (*.html ở thư mục gốc)
    for old in ROOT.glob('*.html'):
        if old.name not in ('index.html', '404.html'):
            old.unlink()
    built = [build(p) for p in sorted((SRC / 'pages').glob('*.html'))]
    print('Built:', ', '.join(built))
