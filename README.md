# COCO365 – Website tĩnh (HTML/CSS/JS)

Website bán hàng tĩnh cho **COCO365 – Giọt lành mỗi ngày**, dựng theo `design.jpeg`, responsive từ desktop đến mobile.

## Chạy thử

```bash
python3 -m http.server 8365
# mở http://localhost:8365
```

## Cấu trúc

URL không có đuôi `.html` mà không cần cấu hình server: mỗi trang là một thư mục chứa `index.html`
(web server nào cũng tự trả về `index.html` của thư mục).

```
/                          index.html – Trang chủ
/san-pham/                 Thực đơn (lọc danh mục, giá, tìm kiếm, sắp xếp) – ?cat=…&q=…
/san-pham-chi-tiet/        Chi tiết sản phẩm – ?id=…
/gio-hang/                 Giỏ hàng + đặt hàng
/gioi-thieu/               Giới thiệu (câu chuyện, quy trình, chất lượng)
/tin-tuc/                  Tin tức
/tin-tuc-chi-tiet/         Bài viết – ?id=…
/lien-he/                  Liên hệ + bản đồ
/chinh-sach/               Hướng dẫn mua hàng, vận chuyển, đổi trả, thanh toán, bảo mật
/faq/                      Câu hỏi thường gặp
404.html                   Trang lỗi (dùng đường dẫn tuyệt đối "/", cần đặt site ở gốc tên miền)
assets/css/style.css       Toàn bộ giao diện
assets/js/data.js          DỮ LIỆU: thông tin cửa hàng, danh mục, sản phẩm, giá, tin tức
assets/js/main.js          Header, menu, tìm kiếm, giỏ hàng, thẻ sản phẩm
assets/js/pages/*.js       Script riêng từng trang
assets/img/                Ảnh (WebP) lấy từ coco365.vn
_src/                      Mã nguồn để ghép header/footer
```

## Sửa nội dung

- **Sản phẩm, giá, tin tức, số điện thoại, địa chỉ, phí ship, mã giảm giá:** sửa `assets/js/data.js`.
- **Header / footer / nội dung trang:** sửa trong `_src/partials/` hoặc `_src/pages/`, rồi chạy:

```bash
python3 _src/build.py
```

Lệnh này tạo lại `index.html`, `404.html` và các thư mục trang. Đừng sửa trực tiếp các file đã build vì sẽ bị ghi đè.

Trong `_src/` viết link dạng `san-pham/`, `./`, `assets/...`; build tự thêm `../` cho các trang con.
Trong JS dùng `${COCO.root}` làm tiền tố đường dẫn (ví dụ `${COCO.root}gio-hang/`).

## Lưu ý

- Đây là web tĩnh, không có máy chủ: giỏ hàng và đơn hàng lưu trên trình duyệt (localStorage).
  Khi đặt hàng, nội dung đơn được sao chép sẵn để khách gửi qua Zalo hoặc gọi hotline.
  Muốn nhận đơn tự động cần nối thêm backend (Google Sheets, Formspree, API riêng…).
- Số "đã bán", điểm đánh giá, phí ship 15.000đ, mã `GIOTLANH`, giờ mở cửa là **dữ liệu mẫu** – cần thay bằng số thật.
