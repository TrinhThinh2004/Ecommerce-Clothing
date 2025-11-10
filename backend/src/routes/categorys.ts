// src/routes/category.ts
import { Router } from "express";
import Category from "../models/Categorys";
import Product from "../models/Product";

const router = Router();

//  tất cả danh mục 
router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

//  Lấy 1 danh mục theo ID 
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id, {
      include: [
        {
          model: Product,
          as: "products",
        },
      ],
    });

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi server" });
  }
});

export default router;
