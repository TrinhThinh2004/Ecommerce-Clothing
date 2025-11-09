import { Request, Response } from "express";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import Product from "../models/Product";

/**
 * Tạo mới đơn hàng (và các order item)
 * POST /api/v1/orders
 */
export const createOrder = async (req: Request, res: Response) => {
  const t = await Order.sequelize?.transaction();

  try {
    const {
      user_id,
      full_name,
      phone,
      address,
      city,
      district,
      ward,
      note,
      voucher_code,
      discount_amount = 0,
      shipping_fee = 0,
      total_price,
      payment_method,
      items, // mảng sản phẩm [{product_id, quantity, size, unit_price}]
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống!" });
    }

    const order = await Order.create(
      {
        user_id,
        full_name,
        phone,
        address,
        city,
        district,
        ward,
        note,
        voucher_code,
        discount_amount,
        shipping_fee,
        total_price,
        payment_method,
        payment_status: "pending",
        status: "pending",
      },
      { transaction: t }
    );

    // Tạo các OrderItem
    for (const item of items) {
      await OrderItem.create(
        {
          order_id: order.order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          size: item.size,
          unit_price: item.unit_price,
          subtotal: item.quantity * item.unit_price,
        },
        { transaction: t }
      );
    }

    await t?.commit();

    const fullOrder = await Order.findByPk(order.order_id, {
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    res
      .status(201)
      .json({ message: "Tạo đơn hàng thành công!", data: fullOrder });
  } catch (err) {
    await t?.rollback();
    console.error("Lỗi tạo đơn hàng:", err);
    res.status(500).json({ message: "Lỗi tạo đơn hàng", error: err });
  }
};

/**
 * Lấy danh sách đơn hàng (có thể lọc theo user)
 * GET /api/v1/orders?user_id=123
 */
/**
 * Lấy danh sách đơn hàng (có thể lọc theo user)
 * GET /api/v1/orders?user_id=123
 */
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    let where: any = {};

    if (req.query.user_id) {
      const userId = Number(req.query.user_id);
      if (!isNaN(userId)) {
        where.user_id = userId;
      } else {
        return res.status(400).json({ message: "user_id không hợp lệ" });
      }
    }

    const orders = await Order.findAll({
      where,
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json({ data: orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi lấy danh sách đơn hàng" });
  }
};

/**
 * Lấy chi tiết 1 đơn hàng
 * GET /api/v1/orders/:id
 */
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json({ data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi lấy chi tiết đơn hàng" });
  }
};

/**
 * Cập nhật trạng thái đơn hàng
 * PATCH /api/v1/orders/:id/status
 */
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    await order.update({ status });
    res.json({ message: "Cập nhật trạng thái thành công", data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi cập nhật trạng thái" });
  }
};

/**
 * Xóa đơn hàng
 * DELETE /api/v1/orders/:id
 */
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    await order.destroy();
    res.json({ message: "Xóa đơn hàng thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi xóa đơn hàng" });
  }
};
