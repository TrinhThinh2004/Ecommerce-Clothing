import axiosInstance from "./client";

/* =============== Types =============== */
export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  active: boolean;
  createdAt: string;
};

export type CustomerQuery = {
  q?: string;
  status?: "all" | "active" | "blocked";
  page?: number;
  pageSize?: number;
};

/* =============== API Calls =============== */

// GET list
export async function getAdminCustomers(params: CustomerQuery) {
  const res = await axiosInstance.get("/api/v1/admin/customers", { params });
  return res.data as {
    items: Customer[];
    total: number;
    page: number;
    pageCount: number;
  };
}

// CREATE
export async function createCustomer(data: {
  name: string;
  phone: string;
  email: string;
  active: boolean;
}) {
  const res = await axiosInstance.post("/api/v1/admin/customers", data);
  return res.data as Customer;
}

// UPDATE
export async function updateCustomer(id: string, data: Partial<Customer>) {
  const res = await axiosInstance.put(`/api/v1/admin/customers/${id}`, data);
  return res.data as Customer;
}

// DELETE
export async function deleteCustomer(id: string) {
  await axiosInstance.delete(`/api/v1/admin/customers/${id}`);
}

// BULK Change active
export async function setCustomersActive(ids: string[], active: boolean) {
  const res = await axiosInstance.put(`/api/v1/admin/customers/active`, {
    ids,
    active,
  });
  return res.data;
}
