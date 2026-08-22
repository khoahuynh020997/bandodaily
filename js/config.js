/**
 * config.js - Cấu hình & hằng số ứng dụng
 */

export const STORAGE_KEYS = {
    DISTRICTS: 'kg_districts_data_v3',
    AGENTS: 'kg_agents_data_v3',
    LEGACY_DISTRICTS: 'kg_districts_data',
    LEGACY_AGENTS: 'kg_agents_data',
    ACTIVATED: 'kg_bandodaily_activated_v1'
};

/** Mã kích hoạt hợp lệ (16 ký tự, dạng XXXX-XXXX-XXXX-XXXX) */
export const VALID_CODES = [
    'K9X2-P7M4-L8W1-R3J6',
    '8V4T-1N6Y-Z9B5-Q3C7',
    'H7F3-G2M9-K5P8-W1X4',
    '3D6J-R8B2-9L5T-P1C7',
    'M2W8-X5V1-4N9Q-K7Y3'
];

export const DEFAULT_DISTRICTS = [
    "Huyện Gò Quao", "Huyện Giang Thành", "Huyện Tân Hiệp", "TP. Rạch Giá",
    "TP. Hà Tiên", "TP. Phú Quốc", "Huyện Châu Thành", "Huyện Giồng Riềng",
    "Huyện An Biên", "Huyện An Minh", "Huyện Vĩnh Thuận", "Huyện U Minh Thượng",
    "Huyện Kiên Lương", "Huyện Hòn Đất", "Huyện Kiên Hải"
];

export const DEFAULT_AGENTS = [
    {
        id: "102",
        district: "Huyện Gò Quao",
        name: "Đại lý Năm Ấn",
        owner: "Cô Năm",
        phone: "0963633633",
        address: "Thị trấn Gò Quao, Huyện Gò Quao",
        mapQuery: "Đại lý Năm Ấn Gò Quao Kiên Giang",
        note: "Lân supe, lân canxi, lân đen, NPK 30-10-10",
        targetSales: 50,
        dailySales: { 1: { 8: 4, 22: 3.5 }, 2: { 5: 5, 10: 8 }, 3: { 12: 6 }, 8: { 3: 7.5 } },
        image: "",
        farmers: [
            {
                id: "f1",
                name: "Nguyễn Văn Tèo",
                phone: "0987123456",
                area: "2.5 ha",
                mapQuery: "Ruộng Tèo Kênh 5 Gò Quao",
                image: "",
                zalo: "https://zalo.me/0987123456",
                products: "20 bao NPK"
            }
        ],
        createdAt: "2026-01-12T00:00:00.000Z"
    },
    {
        id: "103",
        district: "Huyện Gò Quao",
        name: "Đại lý Chiêu Siêu",
        owner: "Anh Siêu",
        phone: "0912345678",
        address: "Xã Vĩnh Hòa Hưng Bắc, Gò Quao",
        mapQuery: "Đại lý Chiêu Siêu Gò Quao",
        note: "Ure, kali, DAP, thuốc trừ sâu",
        targetSales: 80,
        dailySales: { 1: { 4: 6, 18: 5 }, 2: { 9: 8 }, 4: { 2: 10, 21: 4.5 }, 7: { 14: 9 } },
        image: "",
        farmers: [
            {
                id: "f2",
                name: "Trần Thị Bé",
                phone: "0908123456",
                area: "4 ha",
                mapQuery: "Ruộng Bé Vĩnh Hòa Hưng Bắc",
                image: "",
                zalo: "https://zalo.me/0908123456",
                products: "Kali + lân"
            }
        ],
        createdAt: "2026-01-20T00:00:00.000Z"
    },
    {
        id: "104",
        district: "Huyện Gò Quao",
        name: "Đại lý Út Lan",
        owner: "Út Lan",
        phone: "0938777123",
        address: "Xã Định Hòa, Gò Quao",
        mapQuery: "Đại lý Út Lan Định Hòa Gò Quao",
        note: "Phân hữu cơ, NPK 16-16-8",
        targetSales: 40,
        dailySales: { 2: { 14: 3 }, 5: { 6: 4.2 }, 6: { 19: 5 } },
        image: "",
        farmers: [],
        createdAt: "2026-02-02T00:00:00.000Z"
    },
    {
        id: "201",
        district: "Huyện Giồng Riềng",
        name: "Đại lý Út Hùng",
        owner: "Út Hùng",
        phone: "0976555123",
        address: "Thị trấn Giồng Riềng",
        mapQuery: "Đại lý Út Hùng Giồng Riềng",
        note: "Lân nung chảy, NPK",
        targetSales: 70,
        dailySales: { 1: { 11: 7 }, 3: { 8: 9, 25: 6 }, 8: { 1: 8 } },
        image: "",
        farmers: [],
        createdAt: "2026-01-08T00:00:00.000Z"
    },
    {
        id: "202",
        district: "Huyện Giồng Riềng",
        name: "Đại lý Bảy Đạt",
        owner: "Bảy Đạt",
        phone: "0865123789",
        address: "Xã Thạnh Hòa, Giồng Riềng",
        mapQuery: "Đại lý Bảy Đạt Thạnh Hòa",
        note: "Thuốc BVTV, phân bón lá",
        targetSales: 35,
        dailySales: { 4: { 7: 4 }, 5: { 16: 3.8 } },
        image: "",
        farmers: [],
        createdAt: "2026-03-01T00:00:00.000Z"
    },
    {
        id: "301",
        district: "Huyện Tân Hiệp",
        name: "Đại lý Bảy Tâm",
        owner: "Bảy Tâm",
        phone: "0903777888",
        address: "Thị trấn Tân Hiệp",
        mapQuery: "Đại lý Bảy Tâm Tân Hiệp Kiên Giang",
        note: "Ure Phú Mỹ, kali Canada",
        targetSales: 90,
        dailySales: { 1: { 3: 12 }, 2: { 17: 8 }, 3: { 9: 11 }, 6: { 4: 7.5 } },
        image: "",
        farmers: [
            {
                id: "f3",
                name: "Lê Văn Sáu",
                phone: "0923456789",
                area: "6 ha",
                mapQuery: "Ruộng Sáu Tân Hiệp",
                image: "",
                zalo: "https://zalo.me/0923456789",
                products: "Ure 50 bao"
            }
        ],
        createdAt: "2025-12-15T00:00:00.000Z"
    },
    {
        id: "302",
        district: "Huyện Tân Hiệp",
        name: "Đại lý Tám Huệ",
        owner: "Tám Huệ",
        phone: "0944111222",
        address: "Xã Tân Hội, Tân Hiệp",
        mapQuery: "Đại lý Tám Huệ Tân Hội",
        note: "Lân super, NPK 20-20-15",
        targetSales: 45,
        dailySales: { 2: { 22: 5 }, 7: { 8: 6.5 } },
        image: "",
        farmers: [],
        createdAt: "2026-02-18T00:00:00.000Z"
    },
    {
        id: "401",
        district: "TP. Rạch Giá",
        name: "Đại lý Phú Quý",
        owner: "Anh Quý",
        phone: "0918000111",
        address: "Phường Vĩnh Quang, Rạch Giá",
        mapQuery: "Đại lý phân bón Phú Quý Rạch Giá",
        note: "Tổng kho NPK, giao nội ô",
        targetSales: 120,
        dailySales: { 1: { 6: 14, 20: 10 }, 2: { 3: 9 }, 4: { 12: 16 }, 8: { 5: 12 } },
        image: "",
        farmers: [],
        createdAt: "2025-11-02T00:00:00.000Z"
    },
    {
        id: "402",
        district: "TP. Rạch Giá",
        name: "Đại lý Ngọc Ánh",
        owner: "Chị Ánh",
        phone: "0933999000",
        address: "Phường Vĩnh Lạc, Rạch Giá",
        mapQuery: "Đại lý Ngọc Ánh Vĩnh Lạc Rạch Giá",
        note: "Phân bón + vật tư nông nghiệp",
        targetSales: 60,
        dailySales: { 3: { 15: 7 }, 5: { 2: 8.5 } },
        image: "",
        farmers: [],
        createdAt: "2026-01-28T00:00:00.000Z"
    },
    {
        id: "501",
        district: "Huyện Hòn Đất",
        name: "Đại lý Sáu Lợi",
        owner: "Sáu Lợi",
        phone: "0977000444",
        address: "Thị trấn Hòn Đất",
        mapQuery: "Đại lý Sáu Lợi Hòn Đất",
        note: "Lân nung chảy, phân chuồng ủ",
        targetSales: 55,
        dailySales: { 1: { 19: 6 }, 4: { 8: 9 }, 6: { 21: 5.5 } },
        image: "",
        farmers: [],
        createdAt: "2026-01-05T00:00:00.000Z"
    },
    {
        id: "601",
        district: "Huyện Châu Thành",
        name: "Đại lý Thanh Hà",
        owner: "Thanh Hà",
        phone: "0888123456",
        address: "Thị trấn Minh Lương, Châu Thành",
        mapQuery: "Đại lý Thanh Hà Minh Lương",
        note: "NPK, thuốc trừ ốc, phân bón lá",
        targetSales: 48,
        dailySales: { 2: { 7: 4.5 }, 3: { 28: 6 }, 8: { 11: 5 } },
        image: "",
        farmers: [],
        createdAt: "2026-02-09T00:00:00.000Z"
    },
    {
        id: "701",
        district: "Huyện An Biên",
        name: "Đại lý Minh Phát",
        owner: "Minh Phát",
        phone: "0966888999",
        address: "Thị trấn Thứ Ba, An Biên",
        mapQuery: "Đại lý Minh Phát Thứ Ba An Biên",
        note: "Phân cho lúa-tôm, kali",
        targetSales: 42,
        dailySales: { 1: { 14: 5 }, 5: { 9: 7 } },
        image: "",
        farmers: [],
        createdAt: "2026-01-16T00:00:00.000Z"
    },
    {
        id: "801",
        district: "TP. Phú Quốc",
        name: "Đại lý Kim Long",
        owner: "Kim Long",
        phone: "0911222333",
        address: "Dương Đông, Phú Quốc",
        mapQuery: "Đại lý Kim Long Dương Đông Phú Quốc",
        note: "Phân kiểng, phân rau màu",
        targetSales: 30,
        dailySales: { 2: { 2: 2.5 }, 4: { 18: 3 }, 7: { 6: 2.8 } },
        image: "",
        farmers: [],
        createdAt: "2026-03-04T00:00:00.000Z"
    },
    {
        id: "901",
        district: "TP. Hà Tiên",
        name: "Đại lý Hoàng Gia",
        owner: "Hoàng Gia",
        phone: "0944555666",
        address: "Phường Tô Châu, Hà Tiên",
        mapQuery: "Đại lý Hoàng Gia Hà Tiên",
        note: "Vật tư nông nghiệp biên giới",
        targetSales: 38,
        dailySales: { 3: { 5: 4 }, 6: { 12: 5.2 } },
        image: "",
        farmers: [],
        createdAt: "2026-02-22T00:00:00.000Z"
    }
];

export const IMAGE_CONFIG = {
    WIDTH: 300,
    HEIGHT: 400,
    QUALITY: 0.85,
    ASPECT: 3 / 4
};
