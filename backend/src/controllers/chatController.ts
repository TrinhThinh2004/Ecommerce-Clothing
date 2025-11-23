import { Request, Response } from "express";
import Message from "../models/Message";
import User from "../models/User";
import { Op } from "sequelize";

export const getHistory = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    if (Number.isNaN(userId)) return res.status(400).json({ message: "Invalid user id" });

    const messages = await Message.findAll({
      where: { owner_id: userId },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["user_id", "username"],
        },
      ],
      order: [["created_at", "ASC"]],
    });

    res.json(messages);
  } catch (error) {
    console.error('getHistory error:', error);
    const isProd = process.env.NODE_ENV === 'production';
    if (!isProd) {
      return res.status(500).json({ message: (error as any)?.message || 'Server error', stack: (error as any)?.stack });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
