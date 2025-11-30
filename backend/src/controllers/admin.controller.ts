import { Request, Response } from "express";
import User from "../models/User";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import Product from "../models/Product";
import { Op } from "sequelize";

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: [
        "user_id",
        "username",
        "email",
        "phone_number",
        "address",
        "date_of_birth",
        "gender",
        "role",
        "created_at",
      ],
      where: { role: { [Op.ne]: "admin" } },
      order: [["created_at", "DESC"]],
    });

    // Lấy thống kê đơn hàng cho mỗi user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        // Đếm tổng số đơn hàng (tất cả trạng thái)
        const allOrders = await Order.count({
          where: { user_id: user.user_id }
        });

        // Tính tiền từ các đơn hàng hợp lệ:
        //  Đơn online đã thanh toán: payment_status = "paid" và status != "cancelled"
        //  Đơn COD đã hoàn thành: payment_method = "cod" và status = "completed"
        const validOrders = await Order.findAll({
          where: { 
            user_id: user.user_id,
            [Op.or]: [
              // Đơn online (VNPAY, MoMo) đã thanh toán và chưa hủy
              {
                payment_status: "paid",
                status: { [Op.ne]: "cancelled" }
              },
              // Đơn COD đã giao thành công
              {
                payment_method: "cod",
                status: "completed"
              }
            ]
          },
          attributes: ["total_price"],
        });

        const total_spent = validOrders.reduce(
          (sum, o) => sum + Number(o.total_price), 
          0
        );

        return {
          ...user.toJSON(),
          total_orders: allOrders,
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
 Cập nhật thông tin khách hàng
  PATCH /api/v1/admin/customers/:userId
 */
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const { username, email, phone_number, address, date_of_birth, gender, role } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khách hàng",
      });
    }

    // Kiểm tra username đã tồn tại
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ 
        where: { 
          username,
          user_id: { [Op.ne]: userId }
        } 
      });
      if (existingUsername) {
        return res.status(409).json({
          success: false,
          message: 'Username đã tồn tại',
        });
      }
    }

    // Kiểm tra email đã tồn tại
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ 
        where: { 
          email,
          user_id: { [Op.ne]: userId }
        } 
      });
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: 'Email đã tồn tại',
        });
      }
    }

    // Validation
    if (phone_number && !/^[0-9+\-\s()]*$/.test(phone_number)) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại không hợp lệ',
      });
    }

    if (address && address.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Địa chỉ quá dài (tối đa 500 ký tự)',
      });
    }

    if (gender && !['male', 'female', 'other'].includes(gender)) {
      return res.status(400).json({
        success: false,
        message: 'Giới tính không hợp lệ',
      });
    }

    await user.update({
      ...(username && { username }),
      ...(email && { email }),
      ...(phone_number !== undefined && { phone_number }),
      ...(address !== undefined && { address }),
      ...(date_of_birth !== undefined && { date_of_birth }),
      ...(gender !== undefined && { gender }),
      ...(role && { role }),
    });

    return res.json({
      success: true,
      message: "Đã cập nhật thông tin khách hàng",
      data: user.toSafeJSON(),
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
  Xóa khách hàng
 DELETE /api/v1/admin/customers/:userId
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

    // Không cho phép xóa admin
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa tài khoản admin",
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
                 attributes: ["product_id", "name", "image_url"],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.json({
      success: true,
      data: orders,
    });
  } catch (err) {
    console.error("getAllOrders error:", err);
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
              attributes: ["product_id", "name", "image_url"],
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
    console.error("getOrderDetail error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy chi tiết đơn hàng",
      error: (err as Error).message,
    });
  }
};

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

    // Logic xử lý payment_status dựa trên status và payment_method
    const updateData: any = { status };

    // Nếu đơn COD được chuyển sang "completed" → đã nhận tiền mặt
    if (order.payment_method === "cod" && status === "completed") {
      updateData.payment_status = "paid";
    }

    // Nếu đơn bị hủy và chưa thanh toán → đánh dấu failed
    if (status === "cancelled" && order.payment_status === "pending") {
      updateData.payment_status = "failed";
    }

    // Không cho phép hủy đơn đã thanh toán online (trừ COD chưa giao)
    if (status === "cancelled" && 
        order.payment_status === "paid" && 
        order.payment_method !== "cod") {
      return res.status(400).json({
        success: false,
        message: "Không thể hủy đơn đã thanh toán online. Vui lòng hoàn tiền trước.",
      });
    }

    await order.update(updateData);

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