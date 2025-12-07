# Ecommerce-Clothing

![Project Screenshot](/image.png)

## Giới thiệu

`Ecommerce-Clothing` là một ứng dụng mẫu bán quần áo (e-commerce) gồm backend bằng Node.js + TypeScript (Sequelize + Express) và frontend bằng Vite + React + TypeScript. Dự án có chức năng quản lý sản phẩm, người dùng, giỏ hàng, đặt hàng, thanh toán, chat và đánh giá.

## Tính năng chính

- Xác thực người dùng (đăng ký, đăng nhập, phân quyền admin)
- Quản lý sản phẩm & danh mục
- Giỏ hàng và quy trình đặt hàng
- Quản lý đơn hàng và item đơn hàng
- Thanh toán (placeholder / tích hợp)
- Hệ thống bình luận/đánh giá sản phẩm
- Chat/messages giữa người dùng (bộ migration `create-messages` có trong repo)

## Kiến trúc & Công nghệ

- Backend: Node.js, TypeScript, Express, Sequelize, SQLite/Postgres/MySQL (tùy config)
- Frontend: React, Vite, TypeScript
- Migrations & Seeders: `sequelize-cli`

## Cấu trúc repo (tóm tắt)

- `backend/` — API server (TypeScript)
  - `src/controllers` — controllers cho các route
  - `src/models` — Sequelize models
  - `src/middleware` — middlewares (auth, upload, checkAdmin)
  - `migrations/`, `seeders/` — migration và seed data
- `frontend/` — ứng dụng React (Vite)

## Cài đặt & Chạy (Local)

1. Backend

- Cài dependencies và chạy server:

```powershell
cd backend;
npm install;
npm run build # nếu có dựng TS
npm run dev   # hoặc npm start theo script trong package.json
```

- Migrations & seeders (ví dụ dùng `sequelize-cli`):

```powershell
# hoàn tác tất cả migration (ví dụ cần reset DB)
npx sequelize-cli db:migrate:undo:all;

# chạy migration
npx sequelize-cli db:migrate;

# chạy seeders
npx sequelize-cli db:seed:all;
```

2. Frontend

```powershell
cd frontend;
npm install;
npm run dev;
```

## Biến môi trường (ví dụ)

- Backend: `DATABASE_URL`, `PORT`, `JWT_SECRET`, `SMTP_*` (xem `backend/src/config`)
- Frontend: `VITE_API_BASE_URL` hoặc tương tự (xem mã trong `frontend/src/api/client.ts`)

## Góp ý & Phát triển

- Muốn thêm API mới: tạo branch, thêm migration (nếu cần), viết controller và route, tạo PR.
- Thực hiện code style & lint trước khi commit.

## Tài liệu liên quan

- Sequelize migrations: https://sequelize.org/docs/v6/other-topics/migrations/
