import { Request, Response } from "express";
import OrderItem from "../models/OrderItem";
import Product from "../models/Product";

/**
 lấy tất cả order items 
 */
export const getAllOrderItems = async (req: Request, res: Response) => {
  try {
    const where: any = {};
    if (req.query.order_id) where.order_id = req.query.order_id;

    const items = await OrderItem.findAll({
      where,
      include: [{ model: Product, as: "product" }],
      order: [["created_at", "DESC"]],
    });

    res.json({ success: true, data: items });
  } catch (err) {
    console.error("❌ Lỗi getAllOrderItems:", err);
    res.status(500).json({ success: false, message: "Lỗi lấy danh sách order items" });
  }
};

/**
 lấy  order items theo ID
 */
export const getOrderItemById = async (req: Request, res: Response) => {
  try {
    const item = await OrderItem.findByPk(req.params.id, {
      include: [{ model: Product, as: "product" }],
    });

    if (!item)
      return res.status(404).json({ success: false, message: "Không tìm thấy order item" });

    res.json({ success: true, data: item });
  } catch (err) {
    console.error("❌ Lỗi getOrderItemById:", err);
    res.status(500).json({ success: false, message: "Lỗi lấy order item" });
  }
};

/**
 cập nhât order items 
 */
export const updateOrderItem = async (req: Request, res: Response) => {
  try {
    const { quantity, size } = req.body;

    const item = await OrderItem.findByPk(req.params.id);
    if (!item)
      return res.status(404).json({ success: false, message: "Không tìm thấy order item" });

    await item.update({ quantity, size });
    res.json({ success: true, message: "Cập nhật thành công", data: item });
  } catch (err) {
    console.error("❌ Lỗi updateOrderItem:", err);
    res.status(500).json({ success: false, message: "Lỗi cập nhật order item" });
  }
};

/**
 * Xóa order item
 
 */
export const deleteOrderItem = async (req: Request, res: Response) => {
  try {
    const item = await OrderItem.findByPk(req.params.id);
    if (!item)
      return res.status(404).json({ success: false, message: "Không tìm thấy order item" });

    await item.destroy();
    res.json({ success: true, message: "Xóa item thành công" });
  } catch (err) {
    console.error("❌ Lỗi deleteOrderItem:", err);
    res.status(500).json({ success: false, message: "Lỗi xóa order item" });
  }
};
