

import { Calendar } from "lucide-react";


type Article = {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  href: string;
};

// 2. TẠO DỮ LIỆU MẪU (MOCK DATA)

const mockArticles: Article[] = [
  {
    id: 1,
    title: "Quần Áo Nam Quận 8 - Shop Thời Trang Mới Phong Cách Cho Nam Giới",
    excerpt:
      "Giữa nhịp sống năng động của Quận 8, việc tìm một shop quần áo đẹp và đáng tin cậy không chỉ là để mua sắm,...",
    imageUrl: "/public/article-1.png",
    date: "30/10/2025",
    href: "#",
  },
  {
    id: 2,
    title: "10 Phong Cách Thời Trang Nam Hiện Đại Phổ Biến Nhất",
    excerpt:
      "Bạn đã bao giờ đứng trước một tủ đồ đầy ắp mà vẫn không biết mặc gì chưa? Đó không chỉ là chuyện cảm...",
    imageUrl: "/public/article-2.png",
    date: "28/10/2025",
    href: "#",
  },
  {
    id: 3,
    title: "Quần Tây Ống Rộng Nam Mặc Với Áo Gì? ",
    excerpt:
      "Quần tây ống rộng nam đang dần đầu xu hướng thời trang hiện đại nhờ sự kết hợp hài hòa giữa vẻ thoải mái...",
    imageUrl: "/public/article-3.png",
    date: "28/10/2025",
    href: "#",
  },
  {
    id: 4,
    title: "Smart Casual Là Gì? Bí Quyết Phối Đồ Phong Cách ",
    excerpt:
      "Bạn đã bao giờ đứng trước tủ quần áo và tự hỏi: Mặc gì cho buổi họp không quá trang trọng nhưng vẫn cần sự...",
    imageUrl: "/public/article-1.png",
    date: "28/10/2025",
    href: "#",
  },
  {
    id: 5,
    title: "15+ Outfit Phối Đồ Cho Người Béo Bụng, Hack Dáng Nhất",
    excerpt:
      "Nếu bạn từng lúng túng khi chọn quần áo vì vòng hai không hoàn hảo, bài viết này dành cho bạn. Dù là nam...",
    imageUrl: "/public/article-2.png",
    date: "13/10/2025",
    href: "#",
  },
  {
    id: 6,
    title: "Top 7 Shop Quần Áo Rạch Giá Đẹp, Giá Tốt",
    excerpt:
      "Thị trường thời trang tại Rạch Giá ngày càng sôi động với sự góp mặt của nhiều thương hiệu lớn nhỏ, mang đến...",
    imageUrl: "/public/article-3.png",
    date: "13/10/2025",
    href: "#",
  },
  {
    id: 7,
    title: "12+ Outfit Phối Đồ Thời Trang Nam Cao 1m7 Hack Dáng",
    excerpt:
      "Sở hữu chiều cao 1m7 được xem là một vóc dáng khá lý tưởng và phổ biến của nam giới Việt Nam. Tuy nhiên, đ...",
    imageUrl: "/public/article-1.png",
    date: "13/10/2025",
    href: "#",
  },
  {
    id: 8,
    title: "Quần Trắng Phối Áo Màu Gì? Gợi Ý 15 Outfit Nam Với Quần Trắng",
    excerpt:
      "Màu trắng mang lại cảm giác sạch sẽ, hiện đại và dễ tạo thiện cảm ngay từ ánh nhìn đầu tiên. Tuy nhiên, câu hỏi...",
    imageUrl: "/public/article-2.png",
    date: "09/10/2025",
    href: "#",
  },
];


function ArticleCard({ article }: { article: Article }) {
  return (
    <a
      href={article.href}
      className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Phần hình ảnh */}
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Phần nội dung text */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-[48px] text-base font-bold leading-tight">
          {article.title}
        </h3>
        <p className="line-clamp-3 mt-2 text-sm text-neutral-600">
          {article.excerpt}
        </p>

        {/* Phần footer của card */}
        <div className="mt-auto flex items-center justify-between pt-4 text-xs text-neutral-500">
          <span className="inline-flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {article.date}
          </span>
          <span className="font-semibold group-hover:underline">
            Xem thêm »
          </span>
        </div>
      </div>
    </a>
  );
}

// 4. COMPONENT CHÍNH CỦA TRANG
export default function FashionNewsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">
        Tất cả bài viết
      </h1>

     
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mockArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
