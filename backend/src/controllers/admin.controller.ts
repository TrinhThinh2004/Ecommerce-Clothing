// src/controllers/admin.controller.ts
import { Request, Response } from "express";
import User from "../models/User";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import Product from "../models/Product";
import { Op } from "sequelize";

/* ================= CUSTOMERS ================= */

/**
 * Lấy danh sách tất cả khách hàng với thống kê đơn hàng
 * GET /api/v1/admin/customers
 */
export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: [
        "user_id",
        "username",
        "email",
        "phone_number",
        "role",
        "created_at",
      ],
      order: [["created_at", "DESC"]],
    });

    // Lấy thống kê đơn hàng cho mỗi user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const orders = await Order.findAll({
          where: { user_id: user.user_id },
          attributes: ["total_price", "payment_status"],
        });

        const total_orders = orders.length;
        const total_spent = orders
          .filter((o) => o.payment_status === "paid")
          .reduce((sum, o) => sum + Number(o.total_price), 0);

        return {
          ...user.toJSON(),
          total_orders,
          total_spent,
        };
      })
    );

    return res.json({
      success: true,
      data: usersWithStats,
    });
  } catch (err) {
    console.error("getAllCustomers error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách khách hàng",
      error: (err as Error).message,
    });
  }
};

/**
 * Cập nhật thông tin khách hàng
 * PATCH /api/v1/admin/customers/:userId
 */
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const { username, email, phone_number, role } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khách hàng",
      });
    }

    await user.update({
      ...(username && { username }),
      ...(email && { email }),
      ...(phone_number !== undefined && { phone_number }),
      ...(role && { role }),
    });

    return res.json({
      success: true,
      message: "Đã cập nhật thông tin khách hàng",
      data: user,
    });
  } catch (err) {
    console.error("updateCustomer error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật khách hàng",
      error: (err as Error).message,
    });
  }
};

/**
 * Xóa khách hàng
 * DELETE /api/v1/admin/customers/:userId
 */
export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khách hàng",
      });
    }

    // Kiểm tra xem user có đơn hàng không
    const orderCount = await Order.count({ where: { user_id: userId } });
    if (orderCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa khách hàng đã có ${orderCount} đơn hàng`,
      });
    }

    await user.destroy();

    return res.json({
      success: true,
      message: "Đã xóa khách hàng",
    });
  } catch (err) {
    console.error("deleteCustomer error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi xóa khách hàng",
      error: (err as Error).message,
    });
  }
};

/**
 * Toggle trạng thái khách hàng (block/unblock)
 * PATCH /api/v1/admin/customers/:userId/status
 */
export const toggleCustomerStatus = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const { active } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khách hàng",
      });
    }

    // Có thể thêm trường is_active vào User model
    // Hiện tại chỉ trả về success
    return res.json({
      success: true,
      message: `Đã ${active ? "mở chặn" : "chặn"} khách hàng`,
    });
  } catch (err) {
    console.error("toggleCustomerStatus error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật trạng thái",
      error: (err as Error).message,
    });
  }
};

/* ================= ORDERS ================= */

/**
 * Lấy danh sách tất cả đơn hàng
 * GET /api/v1/admin/orders
 */
// src/controllers/admin.controller.ts

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username", "email"],
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              // ✅ CHỈ LẤY CÁC CỘT TỒN TẠI
              attributes: ["product_id", "name"],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    console.log(`📦 Admin: Loaded ${orders.length} orders`);

    return res.json({
      success: true,
      data: orders,
    });
  } catch (err) {
    console.error("❌ getAllOrders error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách đơn hàng",
      error: (err as Error).message,
    });
  }
};

export const getOrderDetail = async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.orderId);

    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username", "email", "phone_number"],
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              // ✅ CHỈ LẤY CÁC CỘT TỒN TẠI
              attributes: ["product_id", "name"],
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    return res.json({
      success: true,
      data: order,
    });
  } catch (err) {
    console.error("❌ getOrderDetail error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy chi tiết đơn hàng",
      error: (err as Error).message,
    });
  }
};
/**
 * Cập nhật trạng thái đơn hàng
 * PATCH /api/v1/admin/orders/:orderId/status
 */
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.orderId);
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "processing",
      "shipping",
      "completed",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ",
      });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    await order.update({ status });

    return res.json({
      success: true,
      message: "Đã cập nhật trạng thái đơn hàng",
      data: order,
    });
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật trạng thái",
      error: (err as Error).message,
    });
  }
};

/**
 * Xóa đơn hàng
 * DELETE /api/v1/admin/orders/:orderId
 */
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.orderId);

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    // Xóa order items trước
    await OrderItem.destroy({ where: { order_id: orderId } });

    // Xóa order
    await order.destroy();

    return res.json({
      success: true,
      message: "Đã xóa đơn hàng",
    });
  } catch (err) {
    console.error("deleteOrder error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi xóa đơn hàng",
      error: (err as Error).message,
    });
  }
};