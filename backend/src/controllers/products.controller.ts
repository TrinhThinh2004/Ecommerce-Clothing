import { Request, Response } from 'express';
import Product from '../models/Product';
import { Op } from "sequelize";

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId) {
      return res.status(400).json({ message: 'Vui lòng cung cấp ID danh mục' });
    }
    const products = await Product.findAll({
      where: { category_id: Number(categoryId) },
      order: [['created_at', 'DESC']],
    });
    const data = products.map((p) => p.get({ plain: true }));
    return res.json({ data });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll({
      order: [['product_id', 'DESC']],
    });

    const data = products.map((p) => p.get({ plain: true }));
    return res.json({ data });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Lấy sản phẩm theo id
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json({ data: product.get({ plain: true }) });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Tạo mới sản phẩm
export const createProduct = async (req: Request, res: Response) => {
  try {
    if ((req as any).file) {
      const file = (req as any).file;
      req.body.image_url = `/uploads/products/${file.filename}`;
    }
    const newProduct = await Product.create(req.body);
    return res.status(201).json({ data: newProduct.get({ plain: true }) });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if ((req as any).file) {
      const file = (req as any).file;
      req.body.image_url = `/uploads/products/${file.filename}`;
    }
    await product.update(req.body);
    return res.json({ data: product.get({ plain: true }) });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Xóa sản phẩm
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.destroy();
    return res.json({ message: 'Product deleted' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// 🔍 Tìm kiếm sản phẩm theo tên hoặc mô tả
export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm" });
    }

    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } },
        ],
      },
      order: [["created_at", "DESC"]],
    });

    const data = products.map((p) => p.get({ plain: true }));
    return res.json({ data });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};