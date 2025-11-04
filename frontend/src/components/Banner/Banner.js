import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, A11y, Keyboard, } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
// import ảnh
import banner1 from "../../assets/Banner/banner1.jpg";
import banner2 from "../../assets/Banner/banner2.jpg";
import banner3 from "../../assets/Banner/banner3.jpg";
const BANNERS = [
    { id: 1, url: banner1, alt: "Banner 1" },
    { id: 2, url: banner2, alt: "Banner 2" },
    { id: 3, url: banner3, alt: "Banner 3" },
];
export default function Banner() {
    return (_jsx("section", { className: "mx-auto mt-[10px] max-w-[1170px] py-3", children: _jsxs("div", { className: "relative h-[464.5px]", children: [_jsx(Swiper, { modules: [Autoplay, Navigation, Pagination, A11y, Keyboard], slidesPerView: 1, loop: true, speed: 600, keyboard: { enabled: true }, autoplay: {
                        delay: 3500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }, pagination: { clickable: true }, navigation: { prevEl: ".banner-prev", nextEl: ".banner-next" }, className: "h-full rounded-xl", children: BANNERS.map((b) => (_jsx(SwiperSlide, { className: "h-full", children: _jsx(BannerImage, { src: b.url, alt: b.alt }) }, b.id))) }), _jsx("button", { className: "banner-prev absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/60", "aria-label": "Banner tr\u01B0\u1EDBc", children: "\u2039" }), _jsx("button", { className: "banner-next absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/60", "aria-label": "Banner sau", children: "\u203A" })] }) }));
}
function BannerImage({ src, alt }) {
    return (_jsx("div", { className: "relative h-full w-full overflow-hidden rounded-xl", children: _jsx("img", { src: src, alt: alt, className: "h-full w-full object-cover", fetchPriority: "high" }) }));
}
