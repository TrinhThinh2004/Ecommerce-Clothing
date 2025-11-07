import React from "react";

export default function OrderGuide() {
  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-extrabold text-center text-neutral-800 mb-6">
          HƯỚNG DẪN ĐẶT HÀNG
        </h1>
        <p className="text-center text-neutral-600 mb-8">
          Làm theo các bước sau để hoàn tất đơn hàng của bạn trên website.
        </p>

        <div className="flex justify-center mb-10">
          <img
            src="/order.png" // ✅ Dùng đường dẫn tuyệt đối
            alt="Hướng dẫn đặt hàng 160STORE"
            className="rounded-xl shadow-lg max-w-full h-auto"
          />
        </div>

        <div className="space-y-6 text-neutral-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold mb-2">BƯỚC 1: TRUY CẬP WEBSITE</h2>
            <p>
              Bạn có thể truy cập vào website{" "}
              <a
                href="https://storehanghieutoanquoc160.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                storehanghieutoanquoc160.com
              </a>{" "}
              hoặc{" "}
              <a
                href="https://160store.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                160store.com
              </a>{" "}
              để chọn sản phẩm bạn muốn mua.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">BƯỚC 2: CHỌN SẢN PHẨM</h2>
            <p>
              Chọn danh mục sản phẩm, sau đó click vào sản phẩm cụ thể để xem
              chi tiết, chọn size, màu sắc và thêm vào giỏ hàng. Bạn có thể quay
              lại để mua thêm sản phẩm khác nếu muốn.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">BƯỚC 3: ĐIỀN THÔNG TIN</h2>
            <p>
              Sau khi chọn xong sản phẩm, bạn tiến hành <b>THANH TOÁN</b> bằng
              cách điền đầy đủ thông tin giao hàng của bạn. Hãy đảm bảo số điện
              thoại và địa chỉ nhận hàng chính xác để tránh lỗi khi giao hàng.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">
              BƯỚC 4: CHỌN HÌNH THỨC THANH TOÁN
            </h2>
            <p>
              Bạn có thể chọn thanh toán khi nhận hàng (COD), hoặc chuyển khoản
              ngân hàng. Nếu có mã giảm giá, nhập mã vào ô tương ứng và chọn{" "}
              <b>“Sử dụng”</b>.
            </p>
          </section>
        </div>

        <div className="text-center mt-10 text-neutral-700 font-medium">
          <p>💬 Xin chân thành cảm ơn và hân hạnh được phục vụ Quý Khách!</p>
        </div>
      </div>
    </div>
  );
}
