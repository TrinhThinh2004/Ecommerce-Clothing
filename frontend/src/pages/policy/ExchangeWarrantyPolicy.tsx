import React from "react";

export default function ExchangeWarrantyPolicy() {
  return (
    <div className="bg-white min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center text-neutral-800 mb-6">
          CHÍNH SÁCH ĐỔI HÀNG & BẢO HÀNH
        </h1>

        <p className="text-center text-neutral-600 mb-10">
          Nhằm mang lại các quyền lợi hợp lý nhất tới cho khách hàng mua sắm tại
          hệ thống <b>160STORE</b>, từ ngày <b>01/09/2024</b> 160STORE có chính
          sách đổi trả và bảo hành như sau:
        </p>

        {/* --- ĐIỀU 1 --- */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-amber-700 mb-3">
            ĐIỀU 1: CHÍNH SÁCH ĐỔI HÀNG
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-neutral-700">
            <li>
              Sản phẩm đổi trả trong thời hạn 15 ngày kể từ ngày mua trên hóa
              đơn (Đổi với khách mua tại store), 15 ngày kể từ ngày nhận hàng
              được xác nhận trên đơn vận chuyển (Đổi với khách mua online).
            </li>
            <li>
              Sản phẩm đổi hàng bị lỗi kỹ thuật, hư hỏng, sai màu, sai mẫu, sản
              phẩm không bị dơ, hư hỏng do lỗi bên khách hàng, còn đầy đủ tag,
              tem, nhãn mác.
            </li>
            <li>Chế độ đổi hàng chỉ áp dụng 1 lần trên 1 hóa đơn.</li>
          </ul>

          <p className="mt-4 text-neutral-700">
            👉 Khách hàng mang sản phẩm & hóa đơn đến cửa hàng 160STORE nơi đã
            mua hàng hoặc bất kỳ chi nhánh nào khác của hệ thống để đổi. Với đơn
            online, khách hàng vui lòng gửi sản phẩm về kho để xử lý đổi hàng.
          </p>

          <p className="mt-4 text-neutral-700">
            Sản phẩm mua trong CTKM quý khách vui lòng đổi trong thời gian CTKM
            để áp dụng ưu đãi. Ngoài thời gian này, chính sách đổi sẽ tính theo
            giá niêm yết tại thời điểm hiện tại.
          </p>

          <p className="mt-4 text-neutral-700">
            ⚠️ Chính sách không áp dụng cho sản phẩm sale, đồ lót, vớ, boxer.
          </p>
        </section>

        {/* --- ĐIỀU 2 --- */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-amber-700 mb-3">
            ĐIỀU 2: CHÍNH SÁCH ĐỔI DO LỖI KỸ THUẬT VÀ HOÀN TIỀN
          </h2>
          <p className="mb-3">
            <b>Điều kiện áp dụng:</b>
          </p>
          <ul className="list-disc pl-6 space-y-2 text-neutral-700">
            <li>
              Sản phẩm lỗi kỹ thuật như: đường chỉ, phai màu, chất liệu, kiểu
              dáng, bung keo, ...
            </li>
            <li>Sản phẩm không đúng mô tả hoặc không đúng đơn hàng.</li>
          </ul>
          <p className="mt-4">
            Lưu ý: Sản phẩm áp dụng đổi/hoàn tiền là sản phẩm mới (đổi sản phẩm
            lỗi kỹ thuật trong 15 ngày kể từ ngày mua/nhận hàng trên hóa đơn).
          </p>
          <p className="mt-2 font-medium text-red-600">
            Trường hợp không được giải quyết: Sản phẩm đã qua sử dụng.
          </p>
        </section>

        {/* --- ĐIỀU 3 --- */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-amber-700 mb-3">
            ĐIỀU 3: CHÍNH SÁCH BẢO HÀNH
          </h2>
          <p className="mb-3">Các trường hợp và thời gian bảo hành:</p>

          <table className="w-full border border-neutral-300 text-sm mb-5">
            <thead className="bg-amber-100 font-semibold">
              <tr>
                <th className="border p-2">Tên sản phẩm</th>
                <th className="border p-2">Điều kiện bảo hành</th>
                <th className="border p-2">Thời gian bảo hành</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Quần, Áo, Nón</td>
                <td className="border p-2">Đường chỉ, dây kéo, khuy...</td>
                <td className="border p-2 text-center">30 ngày</td>
              </tr>
              <tr>
                <td className="border p-2">Thắt lưng</td>
                <td className="border p-2">
                  Dây lưng bong tróc, nứt da, lỗi kỹ thuật.
                </td>
                <td className="border p-2 text-center">30 ngày</td>
              </tr>

              <tr>
                <td className="border p-2">
                  TechUrban Jeans, ICONOIS Jeans, ProCool Jeans
                </td>
                <td className="border p-2">Nút, khoá kéo</td>
                <td className="border p-2 text-center">Trọn đời</td>
              </tr>
            </tbody>
          </table>

          <p className="text-neutral-700 mb-3">
            <b>CHÍNH SÁCH BẢO HÀNH GIÀY - DÉP:</b> Áp dụng bảo hành trọn đời sản
            phẩm đối với các lỗi bung keo, đường chỉ trong quá trình sử dụng.
          </p>

          <p className="font-medium text-red-600 mb-2">
            Trường hợp không được bảo hành:
          </p>
          <ul className="list-disc pl-6 text-neutral-700 space-y-1">
            <li>
              Giặt sản phẩm bằng nước nóng, chất tẩy rửa gây ảnh hưởng đến màu
              sắc, form dáng.
            </li>
            <li>
              Sản phẩm bị ẩm mốc, bám bụi bẩn, hư hại do sử dụng sai cách.
            </li>
            <li>
              Sản phẩm bị tác động mạnh dẫn đến biến dạng, trầy xước, rách.
            </li>
          </ul>
        </section>

        {/* --- ĐIỀU 4 --- */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-amber-700 mb-3">
            ĐIỀU 4: CHI PHÍ ĐỔI HÀNG
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-neutral-700">
            <li>
              Miễn phí đổi hàng nếu sản phẩm bị lỗi kỹ thuật do nhà sản xuất.
            </li>
            <li>
              Trường hợp đổi hàng do khách không ưng ý hoặc đổi size, khách hàng
              chịu phí vận chuyển 2 chiều.
            </li>
            <li>
              (Đối với khách hàng Online): Phí ship đổi hàng sẽ do khách hàng
              chi trả.
            </li>
          </ul>

          <p className="mt-4 text-center text-sm text-neutral-600">
            💬 Mọi thắc mắc xin liên hệ hệ thống cửa hàng 160STORE để được hỗ
            trợ nhanh nhất!
          </p>
        </section>
      </div>
    </div>
  );
}
