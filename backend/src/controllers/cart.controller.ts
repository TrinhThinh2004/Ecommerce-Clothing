// backend/src/controllers/cart.controller.ts
import { Request, Response } from "express";
import sequelize from "../config/database";
import Cart from "../models/Cart";
import Product from "../models/Product";


const parseQuantity = (value: any): number => {
  const qty = Number(value);
  if (isNaN(qty) || qty < 0) throw new Error("Số lượng không hợp lệ");
  return qty;
};


export const getCartByUser = async (req: Request, res: Response) => {
  try {
    
    const user_id = req.user?.user_id;
    
    if (!user_id) {
      return res.status(401).json({ 
        success: false, 
        message: "Chưa đăng nhập" 
      });
    }

    const cart = await Cart.findAll({
      where: { user_id },
      include: [{ 
        model: Product, 
        as: "product",
        attributes: ['product_id', 'name', 'image_url', 'price', 'stock_quantity']
      }],
      order: [["created_at", "DESC"]],
    });

    return res.json({ success: true, cart });
  } catch (err) {
    console.error(" Lỗi getCartByUser:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Lỗi máy chủ" 
    });
  }
};

/**
 * ➕ Thêm sản phẩm vào giỏ hàng
 */
export const addToCart = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  
  try {
    const user_id = req.user?.user_id;
    
    if (!user_id) {
      await t.rollback();
      return res.status(401).json({ 
        success: false, 
        message: "Chưa đăng nhập" 
      });
    }

    const { product_id, quantity = 1, size } = req.body;

    if (!product_id) {
      await t.rollback();
      return res.status(400).json({ 
        success: false, 
        message: "product_id bắt buộc" 
      });
    }

    const qty = parseQuantity(quantity);
    if (qty <= 0) {
      await t.rollback();
      return res.status(400).json({ 
        success: false, 
        message: "Số lượng phải > 0" 
      });
    }

    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findByPk(product_id);
    if (!product) {
      await t.rollback();
      return res.status(404).json({ 
        success: false, 
        message: "Sản phẩm không tồn tại" 
      });
    }

    // Tìm item hiện có (same product + size)
    const existing = await Cart.findOne({
      where: { 
        user_id, 
        product_id, 
        size: size || null 
      },
      transaction: t,
    });

    let cartItem;

    const totalRequested = qty + (existing ? existing.quantity : 0);

    if (totalRequested > product.stock_quantity) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: `Sản phẩm chỉ còn ${product.stock_quantity} sản phẩm trong kho`,
      });
    }

    if (existing) {
      // Cập nhật số lượng
      existing.quantity += qty;
      await existing.save({ transaction: t });
      cartItem = existing;
    } else {
      // Tạo mới
      cartItem = await Cart.create({
        user_id,
        product_id,
        quantity: qty,
        size: size || null,
        price_snapshot: Number(product.price),
      }, { transaction: t });
    }

    await t.commit();
    
    return res.status(200).json({ 
      success: true, 
      item: cartItem,
      message: "Đã thêm vào giỏ hàng"
    });

  } catch (err) {
    await t.rollback();
    console.error(" Lỗi addToCart:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Lỗi thêm vào giỏ hàng: " + (err as Error).message 
    });
  }
};


export const updateCartItem = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  
  try {
    const cart_id = Number(req.params.id);
    const user_id = req.user?.user_id;
    const qty = parseQuantity(req.body.quantity);

    // Tìm item và kiểm tra ownership
    const item = await Cart.findOne({
      where: { cart_id, user_id },
      transaction: t
    });

    if (!item) {
      await t.rollback();
      return res.status(404).json({ 
        success: false, 
        message: "Không tìm thấy sản phẩm trong giỏ" 
      });
    }

    const product = await Product.findByPk(item.product_id, { transaction: t });

    if (!product) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không tồn tại",
      });
    }

    if (qty <= 0) {
      // Xóa nếu qty <= 0
      await item.destroy({ transaction: t });
      await t.commit();
      return res.json({ 
        success: true, 
        message: "Đã xóa sản phẩm" 
      });
    }

    if (qty > product.stock_quantity) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: `Chỉ còn ${product.stock_quantity} sản phẩm trong kho`,
      });
    }

    // Cập nhật
    item.quantity = qty;
    await item.save({ transaction: t });
    await t.commit();

    return res.json({ 
      success: true, 
      item, 
      message: "Cập nhật thành công" 
    });

  } catch (err) {
    await t.rollback();
    console.error(" Lỗi updateCartItem:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Lỗi cập nhật giỏ hàng" 
    });
  }
};


export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const cart_id = Number(req.params.id);
    const user_id = req.user?.user_id;

    // Chỉ xóa nếu thuộc về user hiện tại
    const deleted = await Cart.destroy({ 
      where: { cart_id, user_id } 
    });

    if (!deleted) {
      return res.status(404).json({ 
        success: false, 
        message: "Không tìm thấy sản phẩm" 
      });
    }

    return res.json({ 
      success: true, 
      message: "Đã xóa khỏi giỏ hàng" 
    });

  } catch (err) {
    console.error(" Lỗi removeCartItem:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Lỗi xóa sản phẩm" 
    });
  }
};/**
 *  Xóa toàn bộ giỏ hàng của user */
export const clearCart = async (req: Request, res: Response) => {
  try {
    const user_id = req.user?.user_id;
    if (!user_id) {
      return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
    }

    const deletedCount = await Cart.destroy({
      where: { user_id }
    });

    return res.json({
      success: true,
      message: `Đã xóa ${deletedCount} sản phẩm khỏi giỏ hàng`
    });

  } catch (err) {
    console.error(" Lỗi clearCart:", err);
    return res.status(500).json({ success: false, message: "Lỗi xóa giỏ hàng" });
  }
};
