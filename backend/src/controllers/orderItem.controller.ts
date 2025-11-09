import { Request, Response } from "express";
import OrderItem from "../models/OrderItem";
import Product from "../models/Product";

/**
 * Lấy toàn bộ order items
 * GET /api/v1/order-items
 */
export const getAllOrderItems = async (_req: Request, res: Response) => {
  try {
    const items = await OrderItem.findAll({
      include: [{ model: Product, as: "product" }],
    });
    res.json({ data: items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi lấy danh sách order items" });
  }
};

/**
 * Lấy item theo ID
 * GET /api/v1/order-items/:id
 */
export const getOrderItemById = async (req: Request, res: Response) => {
  try {
    const item = await OrderItem.findByPk(req.params.id, {
      include: [{ model: Product, as: "product" }],
    });
    if (!item)
      return res.status(404).json({ message: "Không tìm thấy order item" });
    res.json({ data: item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi lấy order item" });
  }
};

/**
 * Xóa item
 * DELETE /api/v1/order-items/:id
 */
export const deleteOrderItem = async (req: Request, res: Response) => {
  try {
    const item = await OrderItem.findByPk(req.params.id);
    if (!item)
      return res.status(404).json({ message: "Không tìm thấy order item" });
    await item.destroy();
    res.json({ message: "Xóa item thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi xóa order item" });
  }
};
