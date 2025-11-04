import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import StoreCard from "../../components/Stores/StoreCard";
import { ChevronDown } from "lucide-react";
// ===== Mock data (sau này thay bằng API) =====
const STORES = [
    {
        id: "rg-trung-truc",
        name: "RẠCH GIÁ - NGUYỄN TRUNG TRỰC",
        city: "Kiên Giang",
        district: "Rạch Giá",
        address: "247 Nguyễn Trung Trực, Phường Vĩnh Bảo, Rạch Giá, An Giang",
        phone: "02871006789",
        hours: "8:30 - 22:00",
        open: true,
        image: "https://images.unsplash.com/photo-1567443024551-f3e3cc2a3d99?q=80&w=1200&auto=format&fit=crop",
        isNew: true,
    },
    {
        id: "dn-le-duan",
        name: "ĐÀ NẴNG - LÊ DUẪN",
        city: "Đà Nẵng",
        district: "Thanh Khê",
        address: "332 Đ. Lê Duẩn, Phường Thanh Khê, TP.Đà Nẵng",
        phone: "02871006789",
        hours: "8:30 - 22:00",
        open: true,
        image: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=1200&auto=format&fit=crop",
    },
    {
        id: "dl-buon-ma-thuot",
        name: "ĐẮK LẮK - BUÔN MA THUỘT",
        city: "Đắk Lắk",
        district: "Buôn Ma Thuột",
        address: "14 Phan Chu Trinh, Phường Buôn Ma Thuột, Đắk Lắk",
        phone: "02871006789",
        hours: "8:30 - 22:00",
        open: true,
        image: "https://images.unsplash.com/photo-1597806999038-0a7d38e7ca8d?q=80&w=1200&auto=format&fit=crop",
    },
    // thêm vài store mẫu nữa cho có phân trang
    {
        id: "hcm-phan-xich-long",
        name: "HCM - PHAN XÍCH LONG",
        city: "TP. Hồ Chí Minh",
        district: "Phú Nhuận",
        address: "401 Phan Xích Long, Phường 1, Phú Nhuận, TP.HCM",
        phone: "02871006789",
        hours: "8:30 - 22:00",
        open: true,
        image: "https://images.unsplash.com/photo-1515169067865-5387ec356754?q=80&w=1200&auto=format&fit=crop",
    },
    {
        id: "hn-pho-le-dai-hanh",
        name: "HÀ NỘI - PHỐ LÊ ĐẠI HÀNH",
        city: "Hà Nội",
        district: "Hai Bà Trưng",
        address: "Số 26 Phố Lê Đại Hành, Quận Hai Bà Trưng, Hà Nội",
        phone: "02871006789",
        hours: "8:30 - 22:00",
        open: false,
        image: "https://images.unsplash.com/photo-1552858725-8813d783fd2e?q=80&w=1200&auto=format&fit=crop",
    },
    {
        id: "ct-ninh-kieu",
        name: "CẦN THƠ - NINH KIỀU",
        city: "Cần Thơ",
        district: "Ninh Kiều",
        address: "35 Trần Phú, Phường Ninh Kiều, TP.Cần Thơ",
        phone: "02871006789",
        hours: "8:30 - 22:00",
        open: true,
        image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop",
    },
];
const PAGE_SIZE = 6;
// ===== Page =====
export default function StoreLocator() {
    // dữ liệu chọn lọc cho Select
    const cities = useMemo(() => Array.from(new Set(STORES.map((s) => s.city))).sort(), []);
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [page, setPage] = useState(1);
    // districts phụ thuộc theo city
    const districts = useMemo(() => {
        const filtered = city ? STORES.filter((s) => s.city === city) : STORES;
        return Array.from(new Set(filtered.map((s) => s.district))).sort();
    }, [city]);
    const filtered = useMemo(() => {
        let arr = STORES;
        if (city)
            arr = arr.filter((s) => s.city === city);
        if (district)
            arr = arr.filter((s) => s.district === district);
        return arr;
    }, [city, district]);
    // phân trang
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    // khi đổi filter thì quay lại page 1
    function onChangeCity(v) {
        setCity(v);
        setDistrict("");
        setPage(1);
    }
    function onChangeDistrict(v) {
        setDistrict(v);
        setPage(1);
    }
    return (_jsx("div", { className: "bg-gradient-to-b from-amber-50 to-amber-100", children: _jsxs("div", { className: "mx-auto w-full max-w-6xl px-3 py-6 lg:px-0", children: [_jsx("h1", { className: "mb-4 text-2xl font-extrabold", children: "H\u1EC7 th\u1ED1ng c\u1EEDa h\u00E0ng" }), _jsxs("div", { className: "mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2", children: [_jsx(Select, { value: city, onChange: onChangeCity, placeholder: "Ch\u1ECDn T\u1EC9nh/Th\u00E0nh ph\u1ED1", options: cities }), _jsx(Select, { value: district, onChange: onChangeDistrict, placeholder: "Ch\u1ECDn Qu\u1EADn/Huy\u1EC7n", options: districts, disabled: !city })] }), _jsx("div", { className: "grid gap-5 md:grid-cols-2 lg:grid-cols-3", children: pageItems.map((s) => (_jsx(StoreCard, { store: s }, s.id))) }), _jsxs("div", { className: "mt-6 flex items-center justify-center gap-2", children: [_jsx("button", { className: "rounded-md border px-3 py-1.5 text-sm hover:bg-white disabled:opacity-50", onClick: () => setPage((p) => Math.max(1, p - 1)), disabled: page <= 1, children: "Tr\u01B0\u1EDBc" }), _jsxs("span", { className: "text-sm", children: ["Trang ", _jsx("strong", { children: page }), " / ", totalPages] }), _jsx("button", { className: "rounded-md border px-3 py-1.5 text-sm hover:bg-white disabled:opacity-50", onClick: () => setPage((p) => Math.min(totalPages, p + 1)), disabled: page >= totalPages, children: "Sau" })] })] }) }));
}
/* ------- Tiny Select component (Tailwind) ------- */
function Select({ value, onChange, placeholder, options, disabled, }) {
    return (_jsxs("div", { className: `relative rounded-md bg-white ring-1 ring-neutral-200 focus-within:ring-black ${disabled ? "opacity-60" : ""}`, children: [_jsxs("select", { value: value, onChange: (e) => onChange(e.target.value), disabled: disabled, className: "h-11 w-full appearance-none rounded-md bg-transparent px-3 pr-10 text-sm outline-none", children: [_jsx("option", { value: "", children: placeholder }), options.map((o) => (_jsx("option", { value: o, children: o }, o)))] }), _jsx(ChevronDown, { className: "pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" })] }));
}
