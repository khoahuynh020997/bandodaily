/**
 * config.js - Cấu hình & hằng số ứng dụng
 */

export const STORAGE_KEYS = {
    DISTRICTS: 'kg_districts_data',
    AGENTS: 'kg_agents_data'
};

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
        name: "Năm Ấn",
        owner: "Cô Năm",
        phone: "0963633633",
        address: "Gò Quao, Huyện Gò Quao",
        mapQuery: "Đại lý Năm Ấn Gò Quao",
        note: "Lân supe, lân canxi, lân đen, 30-10-10...",
        targetSales: 50,
        dailySales: { 1: {}, 2: { 5: 5, 10: 8 }, 3: {} },
        image: "",
        farmers: [
            {
                id: "f1",
                name: "Nguyễn Văn Tèo",
                phone: "0987123456",
                area: "2.5 ha",
                mapQuery: "Ruộng Tèo",
                image: "",
                zalo: "https://zalo.me/0987123456",
                products: "20 bao NPK"
            }
        ],
        createdAt: new Date().toISOString()
    }
];

export const IMAGE_CONFIG = {
    WIDTH: 300,
    HEIGHT: 400,
    QUALITY: 0.85,
    ASPECT: 3 / 4
};