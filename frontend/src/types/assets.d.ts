declare module "*.jpg" {
  const src: string;
  export default src;
}
declare module "*.jpeg" {
  const src: string;
  export default src;
}
declare module "*.png" {
  const src: string;
  export default src;
}
declare module "*.webp" {
  const src: string;
  export default src;
}
declare module "*.svg" {
  const src: string;
  export default src; // dùng như URL (không phải React component)
}
// src/types/assets.d.ts

// Dạy TypeScript cách xử lý các file CSS
declare module "*.css";

// Bạn cũng có thể thêm các định nghĩa khác ở đây cho các loại file khác
declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";