/* COCO365 – dữ liệu tĩnh của website (sản phẩm, danh mục, tin tức, thông tin liên hệ) */
window.COCO = (function () {
  // Đường dẫn gốc: '' ở trang chủ, '../' ở trang con (đặt qua <body data-root>)
  const ROOT = (document.body && document.body.dataset.root) || '';
  const IMG = ROOT + 'assets/img/';

  const store = {
    name: 'COCO365',
    slogan: 'Giọt lành mỗi ngày',
    owner: 'Dừa Xiêm Bảo Châu',
    address: '76 Nguyễn Văn Cừ, P. Trường Vinh, Nghệ An',
    mapQuery: '76 Nguyễn Văn Cừ, Vinh, Nghệ An',
    hotline: '0973 882 468',
    hotlineRaw: '0973882468',
    orderPhone: '096 4148 133',
    orderPhoneRaw: '0964148133',
    email: 'coco365@gmail.com',
    hours: '7:00 – 22:00 (tất cả các ngày trong tuần)',
    zalo: 'https://zalo.me/333715272260688319',
    facebook: 'https://www.facebook.com/baochaufoods',
    freeShip: 100000,      // miễn phí giao hàng từ mức này
    shipFee: 15000,        // phí giao hàng khi chưa đạt mức miễn phí
    // Mã giảm giá mẫu – chỉnh sửa/xóa cho đúng chương trình thực tế
    coupons: {
      GIOTLANH: { percent: 10, label: 'Giảm 10% tổng đơn' }
    }
  };

  const categories = [
    { id: 'dua-nuong', name: 'Đặc sản dừa nướng', short: 'Dừa nướng', img: IMG + 'products/dac-san-dua-nuong.webp', desc: 'Dừa xiêm nướng than hồng – ngọt từ lửa, lành từ tâm.' },
    { id: 'nuoc-dua-xiem', name: 'Nước dừa xiêm', short: 'Nước dừa', img: IMG + 'products/nuoc-dua-xiem.webp', desc: 'Nước dừa xiêm nguyên chất, ngọt thanh tự nhiên.' },
    { id: 'kem-dua', name: 'Kem dừa', short: 'Kem dừa', img: IMG + 'products/kem-dua-closeup.webp', desc: 'Kem dừa mát lạnh, thơm béo, dẻo thơm đặc biệt.' },
    { id: 'sua-dua-non', name: 'Sữa dừa non', short: 'Sữa dừa non', img: IMG + 'products/sua-dua-non.webp', desc: 'Béo ngậy, thanh mát – tinh hoa từ cùi dừa non.' },
    { id: 'coco-sen', name: 'Coco sen', short: 'Coco sen', img: IMG + 'products/coco-sen.webp', desc: 'Nước dừa xiêm cùng hạt sen bùi béo, an thần, giải nhiệt.' },
    { id: 'coco-matcha', name: 'Coco matcha', short: 'Coco matcha', img: IMG + 'products/coco-matcha.webp', desc: 'Matcha đắng dịu hòa cùng nước dừa xiêm tươi mát.' },
    { id: 'dua-so-tuoi', name: 'Dừa sọ tươi', short: 'Dừa sọ', img: IMG + 'products/dua-so-cao-cap.webp', desc: 'Dừa sọ gọt sẵn chuẩn xiêm, tiện lợi mang đi.' },
    { id: 'thach-dua', name: 'Thạch dừa', short: 'Thạch dừa', img: IMG + 'products/thach-dua-xiem.webp', desc: 'Thạch dừa xiêm nguyên quả, mềm mịn, mát lạnh.' }
  ];

  const DRINK_SIZES = [
    { label: 'Ly 500ml', price: 30000 },
    { label: 'Ly 700ml', price: 35000 }
  ];

  const BENEFITS = [
    '100% nguyên liệu tự nhiên',
    'Không chất bảo quản – Không phẩm màu',
    'Tốt cho tim mạch, đẹp da, an thần, giải nhiệt cực tốt'
  ];

  const STORAGE = 'Bảo quản lạnh ở 2 – 5°C. Ngon nhất khi dùng trong ngày. Lắc nhẹ trước khi uống.';

  const products = [
    {
      id: 'dua-nuong-nguyen-qua', name: 'Dừa nướng nguyên quả', cat: 'dua-nuong',
      price: 30000, unit: '1 quả', sold: 128, rating: 4.9, reviews: 36, badge: 'Đặc sản',
      img: IMG + 'products/dua-nuong-nguyen-qua.webp', cut: IMG + 'cut/dua-nuong.webp',
      gallery: [IMG + 'products/dua-nuong-nguyen-qua.webp', IMG + 'products/dac-san-dua-nuong.webp'],
      short: 'Thơm béo – Đậm vị',
      intro: 'Dừa xiêm được nướng chậm trên than hồng cho đến khi vỏ cháy sém đều, giữ trọn vị ngọt đậm và hương thơm khói đặc trưng. Nước dừa nướng ngọt sâu hơn, cùi dừa dẻo thơm – đặc sản làm nên thương hiệu COCO365.',
      points: ['Dừa xiêm tuyển chọn, nướng mới mỗi ngày', 'Ngọt tự nhiên, không thêm đường', 'Có thể uống ấm hoặc ướp lạnh đều ngon'],
      storage: 'Bảo quản ngăn mát 2 – 5°C, dùng ngon nhất trong 3 ngày.'
    },
    {
      id: 'nuoc-dua-nuong', name: 'Nước dừa nướng', cat: 'dua-nuong',
      price: 18000, unit: 'Chai 500ml', sold: 96, rating: 4.8, reviews: 21,
      img: IMG + 'products/dac-san-dua-nuong.webp', cut: IMG + 'cut/dua-nuong.webp',
      gallery: [IMG + 'products/dac-san-dua-nuong.webp', IMG + 'products/dua-nuong-nguyen-qua.webp'],
      short: 'Tự nhiên – Tốt cho sức khỏe',
      intro: 'Nước được lấy trực tiếp từ những quả dừa vừa nướng, đóng chai tiện lợi. Vị ngọt đậm, thơm khói nhẹ – thức uống giải khát lành mạnh cho cả gia đình.',
      points: ['Nước dừa nướng nguyên chất 100%', 'Đóng chai 500ml tiện mang đi', 'Không chất bảo quản'],
      storage: STORAGE
    },
    {
      id: 'dua-xiem-qua', name: 'Dừa xiêm quả', cat: 'nuoc-dua-xiem',
      price: 25000, unit: '1 trái', sold: 210, rating: 4.9, reviews: 48, badge: 'Bán chạy',
      img: IMG + 'products/dua-xiem-giai-nhiet.webp', cut: null,
      gallery: [IMG + 'products/dua-xiem-giai-nhiet.webp', IMG + 'gallery/dua-xiem-bo-doi.webp', IMG + 'gallery/dua-xiem-gio.webp'],
      short: 'Tươi ngon – Tự nhiên',
      intro: 'Dừa xiêm gọt sẵn, đục lỗ kèm ống hút – mở ra là uống ngay. Nước trong, ngọt thanh, cùi mỏng mềm. Giải nhiệt tức thì trong những ngày nắng nóng.',
      points: ['Dừa xiêm chuẩn, chọn quả đều nước', 'Gọt sẵn, kèm ống hút tiện lợi', 'Bù khoáng, bù nước tự nhiên'],
      storage: 'Bảo quản ngăn mát 2 – 5°C, dùng trong 5 ngày.'
    },
    {
      id: 'nuoc-dua-xiem-tuoi', name: 'Nước dừa xiêm tươi', cat: 'nuoc-dua-xiem',
      price: 15000, unit: 'Chai 500ml', sold: 184, rating: 4.8, reviews: 40,
      img: IMG + 'products/nuoc-dua-xiem.webp', cut: null,
      gallery: [IMG + 'products/nuoc-dua-xiem.webp', IMG + 'products/dua-xiem-giai-nhiet.webp'],
      short: 'Thanh mát – Giải nhiệt',
      intro: 'Nước dừa xiêm nguyên chất được khui và đóng chai trong ngày. Vị ngọt thanh, mát lành – bổ sung điện giải tự nhiên sau giờ làm việc hay tập luyện.',
      points: ['100% nước dừa xiêm, không pha', 'Khui mới mỗi ngày', 'Giàu kali và điện giải tự nhiên'],
      storage: STORAGE
    },
    {
      id: 'kem-dua-con-dao', name: 'Kem quả dừa Côn Đảo', cat: 'kem-dua',
      price: 35000, unit: '1 quả', sold: 152, rating: 4.9, reviews: 33, badge: 'Mới',
      img: IMG + 'products/kem-dua-con-dao.webp', cut: null,
      gallery: [IMG + 'products/kem-dua-con-dao.webp', IMG + 'products/kem-dua-closeup.webp'],
      short: 'Mát lạnh – Thơm béo',
      intro: 'Những viên kem dừa mềm mịn được múc vào chính quả dừa tươi, rắc đậu phộng rang, thêm cherry và bánh quế giòn. Mát lành, sảng khoái – món tráng miệng được yêu thích nhất mùa hè.',
      points: ['Kem làm từ nước cốt dừa tươi', 'Ăn kèm cùi dừa non trong quả', 'Topping: đậu phộng, cherry, bánh quế'],
      storage: 'Dùng ngay khi nhận hoặc bảo quản ngăn đá.'
    },
    {
      id: 'kem-dua-nuong-com-non', name: 'Kem dừa nướng cốm non', cat: 'kem-dua',
      price: 35000, unit: 'Ly 400ml', sold: 118, rating: 4.8, reviews: 27,
      img: IMG + 'products/kem-dua-closeup.webp', cut: null,
      gallery: [IMG + 'products/kem-dua-closeup.webp', IMG + 'products/kem-dua-con-dao.webp'],
      short: 'Dẻo thơm đặc biệt',
      intro: 'Kem dừa kết hợp nước dừa nướng thơm khói và cốm non dẻo thơm – hương vị lạ miệng chỉ có tại COCO365.',
      points: ['Kem dừa tươi làm trong ngày', 'Cốm non xanh dẻo thơm', 'Vị ngọt dịu, không gắt'],
      storage: 'Dùng ngay khi nhận hoặc bảo quản ngăn đá.'
    },
    {
      id: 'sua-dua-non-matcha', name: 'Sữa dừa non matcha', cat: 'sua-dua-non',
      price: 30000, sizes: DRINK_SIZES, sold: 74, rating: 4.8, reviews: 18,
      img: IMG + 'products/sua-dua-non-matcha.webp', cut: IMG + 'cut/sua-dua-non-matcha.webp',
      gallery: [IMG + 'products/sua-dua-non-matcha.webp', IMG + 'products/sua-dua-non.webp'],
      short: 'Vị ngon tươi mới – Thơm béo, đậm đà',
      intro: 'Lớp matcha xanh mướt đắng dịu phủ trên nền sữa dừa non béo ngậy. Vị ngon tươi mới, thơm béo và đậm đà trong từng ngụm.',
      points: BENEFITS, storage: STORAGE
    },
    {
      id: 'sua-dua-non-tran-chau', name: 'Sữa dừa non trân châu', cat: 'sua-dua-non',
      price: 30000, sizes: DRINK_SIZES, sold: 165, rating: 4.9, reviews: 42, badge: 'Bán chạy',
      img: IMG + 'products/sua-dua-non-tran-chau.webp', cut: IMG + 'cut/sua-dua-non-tran-chau.webp',
      gallery: [IMG + 'products/sua-dua-non-tran-chau.webp', IMG + 'products/sua-dua-non.webp'],
      short: 'Full topping – Vị ngọt tự nhiên',
      intro: 'Sữa dừa non béo ngậy cùng trân châu dừa dai giòn và thạch dừa – vị ngọt tự nhiên, dành riêng cho phái đẹp.',
      points: BENEFITS, storage: STORAGE
    },
    {
      id: 'sua-dua-non-suong-sao', name: 'Sữa dừa non sương sáo', cat: 'sua-dua-non',
      price: 30000, sizes: DRINK_SIZES, sold: 88, rating: 4.8, reviews: 20,
      img: IMG + 'products/sua-dua-non-suong-sao.webp', cut: IMG + 'cut/sua-dua-non-suong-sao.webp',
      gallery: [IMG + 'products/sua-dua-non-suong-sao.webp', IMG + 'products/sua-dua-non.webp'],
      short: 'Tươi mát từ thiên nhiên',
      intro: 'Sương sáo đen mát lạnh kết hợp sữa dừa non thơm béo – thanh nhiệt, nhẹ bụng, tươi mát từ thiên nhiên dành cho bạn.',
      points: BENEFITS, storage: STORAGE
    },
    {
      id: 'bo-gia-dua-non', name: 'Bơ già dừa non', cat: 'sua-dua-non',
      price: 30000, sizes: DRINK_SIZES, sold: 142, rating: 4.9, reviews: 39, badge: 'Đồng giá 25K',
      img: IMG + 'products/bo-gia-dua-non.webp', cut: IMG + 'cut/bo-gia-dua-non.webp',
      gallery: [IMG + 'products/bo-gia-dua-non.webp', IMG + 'news/dong-gia-25k.webp'],
      short: 'Béo vị bơ – Đậm vị dừa',
      intro: 'Bơ sáp xay mịn hòa quyện cùng sữa dừa non, rắc dừa khô nướng giòn thơm phía trên. Béo vị bơ – đậm vị dừa, no lâu mà vẫn nhẹ nhàng.',
      points: BENEFITS, storage: STORAGE
    },
    {
      id: 'coco-sen-dua-long-nhan', name: 'Coco sen dừa long nhãn', cat: 'coco-sen',
      price: 30000, sizes: DRINK_SIZES, sold: 213, rating: 5, reviews: 13, badge: 'Bán chạy',
      img: IMG + 'products/coco-sen-dua-long-nhan.webp', cut: IMG + 'cut/coco-sen-dua-long-nhan.webp',
      gallery: [IMG + 'products/coco-sen-dua-long-nhan.webp', IMG + 'products/coco-sen.webp'],
      short: 'Thanh mát – Giải nhiệt',
      intro: 'Sự kết hợp tinh tế giữa nước dừa xiêm tươi mát, hạt sen bùi béo và long nhãn ngọt dịu mang đến cho bạn một thức uống bổ dưỡng, thanh lọc cơ thể mỗi ngày.',
      points: BENEFITS, storage: STORAGE
    },
    {
      id: 'coco-sen-dua-tran-chau', name: 'Coco sen dừa trân châu', cat: 'coco-sen',
      price: 30000, sizes: DRINK_SIZES, sold: 97, rating: 4.8, reviews: 22,
      img: IMG + 'products/coco-sen-dua-tran-chau.webp', cut: IMG + 'cut/coco-sen-dua-tran-chau.webp',
      gallery: [IMG + 'products/coco-sen-dua-tran-chau.webp', IMG + 'products/coco-sen.webp'],
      short: 'Bùi béo – Dai giòn',
      intro: 'Sự kết hợp tinh tế giữa nước dừa xiêm tươi mát, hạt sen bùi béo và trân châu dừa non, mang đến cho bạn một thức uống bổ dưỡng, thanh lọc cơ thể mỗi ngày.',
      points: BENEFITS, storage: STORAGE
    },
    {
      id: 'coco-matcha-sen-dua', name: 'Coco matcha sen dừa', cat: 'coco-matcha',
      price: 30000, sizes: DRINK_SIZES, sold: 81, rating: 4.8, reviews: 16,
      img: IMG + 'products/coco-matcha-sen-dua.webp', cut: IMG + 'cut/coco-matcha-sen-dua.webp',
      gallery: [IMG + 'products/coco-matcha-sen-dua.webp', IMG + 'products/coco-matcha.webp'],
      short: 'Đắng dịu – Bùi béo',
      intro: 'Sự kết hợp tinh tế giữa nước dừa xiêm tươi mát, hạt sen bùi béo và matcha đắng dịu mang đến cho bạn một thức uống bổ dưỡng, thanh lọc cơ thể mỗi ngày.',
      points: BENEFITS, storage: STORAGE
    },
    {
      id: 'coco-matcha-tran-chau', name: 'Coco matcha trân châu dừa', cat: 'coco-matcha',
      price: 30000, sizes: DRINK_SIZES, sold: 69, rating: 4.7, reviews: 12,
      img: IMG + 'products/coco-matcha-tran-chau.webp', cut: IMG + 'cut/coco-matcha-tran-chau.webp',
      gallery: [IMG + 'products/coco-matcha-tran-chau.webp', IMG + 'products/coco-matcha.webp'],
      short: 'Tươi mát – Dai giòn',
      intro: 'Matcha Nhật đắng dịu trên nền nước dừa xiêm mát lạnh, thêm trân châu dừa dai giòn nhiều màu – vừa đẹp mắt vừa sảng khoái.',
      points: BENEFITS, storage: STORAGE
    },
    {
      id: 'combo-10-dua-so-tuoi', name: '[Combo 10] Dừa sọ tươi chuẩn xiêm', cat: 'dua-so-tuoi',
      price: 140000, sold: 57, rating: 4.9, reviews: 11, badge: 'Combo',
      sizes: [
        { label: 'Nhỏ (400g – 500g)', price: 140000 },
        { label: 'Lớn (500g – 650g)', price: 170000 },
        { label: 'VIP (650g – 900g)', price: 220000 }
      ],
      img: IMG + 'products/dua-so-cao-cap.webp', cut: null,
      gallery: [IMG + 'products/dua-so-cao-cap.webp', IMG + 'products/dua-so-sieu-thi.webp', IMG + 'gallery/dua-xiem-gio.webp'],
      short: 'Gọt sẵn – Tiện lợi',
      intro: 'Combo 10 quả dừa sọ chuẩn xiêm, gọt sạch vỏ xanh, dán tem truy xuất nguồn gốc. Nước ngọt thanh, cùi mềm – tiện để tủ lạnh dùng dần cho cả nhà hoặc làm quà biếu.',
      points: ['Dừa xiêm tuyển chọn, tem nhãn rõ nguồn gốc', 'Gọt sẵn, bọc màng an toàn', 'Giao tận nơi tại Vinh – Nghệ An'],
      storage: 'Bảo quản ngăn mát 2 – 5°C, dùng trong 7 ngày.'
    },
    {
      id: 'combo-3-thach-dua-xiem', name: '[Combo 3] Thạch dừa xiêm', cat: 'thach-dua',
      price: 30000, sold: 176, rating: 4.9, reviews: 10, badge: 'Combo',
      sizes: [
        { label: '1 quả', price: 30000 },
        { label: '3 quả', price: 80000 }
      ],
      img: IMG + 'products/thach-dua-xiem.webp', cut: null,
      gallery: [IMG + 'products/thach-dua-xiem.webp', IMG + 'products/thach-dua-muong.webp', IMG + 'products/thach-dua-can-canh.webp', IMG + 'products/thach-dua-video.webp'],
      short: 'Mềm mịn – Mát lạnh',
      intro: 'Nước dừa xiêm được làm đông thành thạch ngay trong quả dừa: mềm mịn, trong veo, ngọt thanh. Dùng muỗng múc cả thạch lẫn cùi dừa – món ăn vặt mát lạnh cực “gây nghiện”.',
      points: ['Thạch làm từ chính nước dừa xiêm', 'Không phẩm màu, không chất bảo quản', 'Có thêm vị cheese, sen tươi, nhãn tươi'],
      storage: 'Bảo quản ngăn mát 2 – 5°C, dùng trong 3 ngày.'
    }
  ];

  const news = [
    {
      id: 'sieu-hot-dong-gia-25k', title: 'Siêu hot… Đồng giá 25K – Tưng bừng deal giải nhiệt', date: '2026-06-15', cat: 'Khuyến mãi',
      img: IMG + 'news/dong-gia-25k.webp',
      excerpt: 'Từ 15/06 đến 30/06, toàn bộ menu Bơ già dừa non và sữa dừa non đồng giá chỉ 25K. Béo vị bơ – thơm ngậy dừa non – mát lành tận hưởng!',
      body: [
        ['p', 'Hè đến rồi, COCO365 tung deal giải nhiệt siêu shock dành cho tất cả khách hàng: <strong>đồng giá 25K</strong> cho Bơ già dừa non cùng nhiều món sữa dừa non best seller.'],
        ['h2', 'Thời gian áp dụng'],
        ['p', 'Từ ngày <strong>15/06 đến hết 30/06</strong>, áp dụng tại cửa hàng 76 Nguyễn Văn Cừ, P. Trường Vinh và đơn đặt qua hotline/Zalo.'],
        ['h2', '3 bước nhận giảm giá'],
        ['ol', ['Theo dõi fanpage COCO365 – Giọt lành mỗi ngày.', 'Chụp màn hình bài viết khuyến mãi và gửi cho nhân viên khi thanh toán.', 'Chọn món yêu thích và tận hưởng giá chỉ 25K.']],
        ['img', IMG + 'news/dong-gia-25k.webp', 'Poster chương trình đồng giá 25K'],
        ['p', 'Béo vị bơ – thơm ngậy dừa non – mát lành tận hưởng! Gọi ngay <strong>096 4148 133</strong> để đặt hàng và gom đơn cho hội chị em nhé.']
      ]
    },
    {
      id: 'bi-kip-danh-cho-nu-cong-so', title: 'Bí kíp dành cho nữ công sở: làm việc 8 tiếng vẫn đẹp và khỏe', date: '2026-03-31', cat: 'Sống khỏe',
      img: IMG + 'news/nu-cong-so.webp',
      excerpt: 'Phụ nữ hiện đại chẳng chỉ cần giỏi việc nước, đảm việc nhà, mà còn phải biết yêu bản thân đúng cách. Bỏ túi ngay 6 lưu ý nhỏ sau đây!',
      body: [
        ['p', '<strong>Làm việc 8 tiếng/ngày – vẫn ĐẸP và KHỎE!</strong> Phụ nữ hiện đại chẳng chỉ cần giỏi việc nước, đảm việc nhà, mà còn phải biết yêu bản thân đúng cách. Dưới đây là 6 lưu ý nhỏ mà chị em văn phòng nên bỏ túi để vừa giữ dáng, vừa giữ sức khỏe.'],
        ['h2', '1. Uống đủ nước – nhưng đừng đợi khát mới uống'],
        ['p', 'Luôn để sẵn chai nước 500ml trên bàn làm việc và chia đều thành 6–8 lần trong ngày. Da căng, người nhẹ, đầu óc tỉnh táo.'],
        ['h2', '2. Ăn trưa thông minh – giảm cơm, tăng rau'],
        ['p', 'Thay vì nhiều cơm trắng, hãy chọn món ít tinh bột xấu, bổ sung protein và rau xanh. Thêm một ít trái cây sau ăn là điểm cộng lớn!'],
        ['h2', '3. Vận động nhẹ – ít nhất 5 phút mỗi 60 phút'],
        ['p', 'Dù bận đến đâu, đừng ngồi lì cả ngày! Đứng dậy vươn vai, đi lại, xoay cổ tay, cổ chân giúp giảm đau mỏi và cải thiện tuần hoàn máu.'],
        ['h2', '4. Ngủ đủ – đẹp da, sáng dạ, tốt dáng'],
        ['p', 'Giấc ngủ chính là “thẩm mỹ viện tự nhiên”. Tắt điện thoại, thư giãn và ngủ đủ 7–8 tiếng mỗi đêm nhé chị em!'],
        ['h2', '5. Giữ tinh thần tích cực'],
        ['p', 'Căng thẳng khiến cơ thể tích mỡ bụng, rối loạn nội tiết. Mỗi ngày hãy tìm một niềm vui nhỏ: một bản nhạc yêu thích, vài dòng nhật ký, hay đơn giản là tự khen mình hôm nay thật xinh!'],
        ['h2', '6. Bổ sung thực phẩm tốt cho nữ giới'],
        ['p', 'Đừng quên chọn đồ uống lành mạnh từ thiên nhiên như nước dừa tươi, sữa dừa non hay các món coco sen thanh mát. Vừa ngon, vừa giúp da đẹp, dáng xinh lại cực kỳ tiện mang đi làm mỗi ngày.'],
        ['quote', 'Chăm sóc bản thân không cần nhiều tiền – chỉ cần thói quen tốt mỗi ngày.']
      ]
    },
    {
      id: '7-loi-ich-cua-nuoc-dua-xiem', title: '7 lợi ích tuyệt vời của nước dừa xiêm với sức khỏe', date: '2026-05-20', cat: 'Sống khỏe',
      img: IMG + 'products/dua-xiem-giai-nhiet.webp',
      excerpt: 'Không chỉ là thức uống giải khát, nước dừa xiêm còn là “thức uống điện giải tự nhiên” giúp bù nước, đẹp da và hỗ trợ tiêu hóa.',
      body: [
        ['p', 'Nước dừa xiêm được mệnh danh là “thức uống điện giải tự nhiên”. Một quả dừa tươi chứa nhiều kali, magie, vitamin C cùng các chất chống oxy hóa có lợi cho cơ thể.'],
        ['h2', '1. Bù nước và điện giải nhanh'],
        ['p', 'Hàm lượng kali cao giúp cơ thể phục hồi sau khi vận động, làm việc dưới trời nắng hay khi mất nước.'],
        ['h2', '2. Giải nhiệt, thanh lọc cơ thể'],
        ['p', 'Vị ngọt thanh, mát lành giúp hạ nhiệt nhanh chóng trong những ngày hè oi bức.'],
        ['h2', '3. Hỗ trợ tiêu hóa'],
        ['p', 'Các enzyme tự nhiên trong nước dừa giúp hệ tiêu hóa hoạt động nhẹ nhàng hơn.'],
        ['h2', '4. Tốt cho tim mạch'],
        ['p', 'Kali và magie góp phần ổn định huyết áp, hỗ trợ sức khỏe tim mạch khi dùng điều độ.'],
        ['h2', '5. Làn da tươi tắn'],
        ['p', 'Uống đủ nước kết hợp vitamin C và chất chống oxy hóa giúp da ẩm mịn, tươi sáng hơn.'],
        ['h2', '6. Ít calo, hỗ trợ giữ dáng'],
        ['p', 'So với nước ngọt đóng chai, nước dừa ít calo và không chứa đường hóa học.'],
        ['h2', '7. An toàn cho cả gia đình'],
        ['p', 'Trẻ nhỏ, người lớn tuổi đều có thể dùng – chỉ cần chọn dừa tươi, sạch và rõ nguồn gốc.'],
        ['quote', 'Lưu ý: người có bệnh thận hoặc đang điều trị cần hỏi ý kiến bác sĩ về lượng kali nạp vào mỗi ngày.']
      ]
    },
    {
      id: 'vi-sao-dua-nuong-ngot-hon', title: 'Vì sao dừa nướng lại ngọt và thơm hơn dừa tươi?', date: '2026-04-18', cat: 'Câu chuyện dừa',
      img: IMG + 'products/dua-nuong-nguyen-qua.webp',
      excerpt: 'Bí quyết nằm ở lửa than và thời gian. Cùng COCO365 khám phá quy trình làm nên đặc sản “Ngọt từ lửa – Lành từ tâm”.',
      body: [
        ['p', 'Dừa nướng là đặc sản nổi tiếng của miền Tây, nay đã có mặt tại Vinh qua thương hiệu COCO365. Vậy vì sao dừa sau khi nướng lại ngọt và thơm hơn?'],
        ['h2', 'Nhiệt độ làm nước dừa “chín” nhẹ'],
        ['p', 'Khi nướng chậm trên than hồng, nhiệt độ thấm dần vào bên trong, khiến đường tự nhiên trong nước dừa trở nên đậm đà hơn, vị chát nhẹ của dừa non biến mất.'],
        ['h2', 'Hương khói đặc trưng'],
        ['p', 'Lớp vỏ cháy sém đều giữ lại hương khói dịu nhẹ – thứ mùi thơm khiến ai thử một lần cũng nhớ mãi.'],
        ['h2', 'Quy trình tại COCO365'],
        ['ol', ['Tuyển chọn dừa xiêm đủ tuổi, đều nước.', 'Gọt sạch vỏ xanh, giữ lại phần sọ.', 'Nướng chậm trên than hồng 60–90 phút, trở đều tay.', 'Làm nguội tự nhiên, dán tem và bảo quản lạnh 2–5°C.']],
        ['quote', 'Ngọt từ lửa – Lành từ tâm: mỗi quả dừa nướng là cả sự kiên nhẫn của người thợ.']
      ]
    },
    {
      id: 'cach-bao-quan-dua-tuoi', title: 'Cách bảo quản dừa tươi và thạch dừa đúng chuẩn tại nhà', date: '2026-02-26', cat: 'Mẹo hay',
      img: IMG + 'products/thach-dua-muong.webp',
      excerpt: 'Mua nhiều dừa để dành mà sợ hỏng? Áp dụng ngay những mẹo đơn giản sau để dừa luôn tươi ngon như mới.',
      body: [
        ['p', 'Dừa tươi và thạch dừa rất dễ mất vị nếu bảo quản sai cách. Dưới đây là những mẹo đơn giản COCO365 muốn chia sẻ với bạn.'],
        ['h2', 'Dừa sọ gọt sẵn'],
        ['ul', ['Bảo quản ngăn mát 2–5°C, không để ngăn đá.', 'Giữ nguyên màng bọc, tránh để chung với thực phẩm có mùi mạnh.', 'Dùng tốt nhất trong 5–7 ngày.']],
        ['h2', 'Thạch dừa nguyên quả'],
        ['ul', ['Luôn để lạnh, dùng trong 3 ngày.', 'Khi ăn, dùng muỗng múc sát cùi để thưởng thức trọn vị.']],
        ['h2', 'Đồ uống từ dừa'],
        ['ul', ['Lắc đều trước khi uống.', 'Ngon nhất trong ngày; nếu để qua đêm hãy bảo quản lạnh và đậy kín nắp.']],
        ['quote', 'Mẹo nhỏ: dừa tươi ngon khi lắc nghe tiếng nước óc ách, vỏ không nứt, không có mùi chua.']
      ]
    },
    {
      id: 'ra-mat-bo-suu-tap-giot-lanh', title: 'Ra mắt Bộ sưu tập “Giọt lành mỗi ngày” – Hương vị thiên nhiên cho làn da và vóc dáng', date: '2026-01-10', cat: 'Tin COCO365',
      img: IMG + 'banners/bo-suu-tap.webp',
      excerpt: 'Coco matcha trân châu, Coco matcha sen dừa, Bơ già dừa non, Coco sen dừa trân châu và Coco sen dừa long nhãn – 5 thức uống cho hội chị em.',
      body: [
        ['p', 'COCO365 chính thức giới thiệu Bộ sưu tập <strong>“Giọt lành mỗi ngày”</strong> gồm 5 thức uống từ dừa xiêm tươi, kết hợp nguyên liệu tự nhiên tốt cho làn da và vóc dáng.'],
        ['img', IMG + 'banners/bo-suu-tap.webp', 'Bộ sưu tập Giọt lành mỗi ngày'],
        ['ul', ['Coco matcha trân châu', 'Coco matcha sen dừa', 'Bơ già dừa non', 'Coco sen dừa trân châu', 'Coco sen dừa long nhãn']],
        ['p', 'Tất cả đều được làm mới mỗi ngày, 100% nguyên liệu tự nhiên, không chất bảo quản. Gọi ngay <strong>096 4148 133</strong> để đặt hàng – gom đơn cho hội chị em!']
      ]
    }
  ];

  const fmt = (n) => n.toLocaleString('vi-VN') + 'đ';
  const byId = (id) => products.find((p) => p.id === id);
  const catById = (id) => categories.find((c) => c.id === id);
  const newsById = (id) => news.find((n) => n.id === id);
  const fmtDate = (d) => { const [y, m, day] = d.split('-'); return `${+day}/${+m}/${y}`; };

  return { root: ROOT, store, categories, products, news, fmt, byId, catById, newsById, fmtDate };
})();
