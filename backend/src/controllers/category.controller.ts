import { Request, Response } from 'express';
import Category, { CategoryAttributes } from '../models/Categorys';

interface CategoryNode extends CategoryAttributes {
  children: CategoryNode[];
}

export const getCategoryTree = async (req: Request, res: Response) => {
  try {
    const allCategories = await Category.findAll({ order: [['name', 'ASC']] });
    const categoryMap: { [key: number]: CategoryNode } = {};
    const tree: CategoryNode[] = [];

    allCategories.forEach(cat => {
      const categoryNode = cat.get({ plain: true }) as CategoryNode;
      categoryNode.children = [];
      categoryMap[categoryNode.category_id] = categoryNode;
    });

    Object.values(categoryMap).forEach(categoryNode => {
      if (categoryNode.parent_id) {
        const parent = categoryMap[categoryNode.parent_id];
        if (parent) parent.children.push(categoryNode);
      } else {
        tree.push(categoryNode);
      }
    });
    return res.status(200).json(tree);
  } catch (error: any) {
    console.error("Failed to build category tree:", error);
    return res.status(500).json({ message: "Lỗi server khi xử lý danh mục." });
  }
};