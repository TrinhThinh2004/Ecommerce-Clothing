import { useEffect, useState, useCallback } from "react";
import axiosInstance from "./client";

export type AdminUser = {
  user_id: number;
  username: string;
  email?: string;
  phone_number?: string | null;
  role?: string;
  created_at?: string;
};

export const getAdminUsers = async () => {
  const res = await axiosInstance.get("/api/v1/admin/users");
  return res.data?.users as AdminUser[];
};

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminUsers();
      setUsers(data || []);
    } catch (err: any) {
      setError(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refresh: fetchUsers };
}
