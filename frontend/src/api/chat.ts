import axiosInstance from "./client";

export const getChatHistory = async (userId: number | string) => {
  const res = await axiosInstance.get(`/api/v1/chat/history/${userId}`);
  return res.data || [];
};
