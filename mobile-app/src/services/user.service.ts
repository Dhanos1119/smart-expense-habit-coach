// src/services/user.service.ts
import api from "../api/api";

export const UserService = {
  async getProfile() {
    const res = await api.get("/user/me");
    return res.data;
  },

  async updateProfile(data: any) {
    const res = await api.put("/user/update", data);
    return res.data;
  },

  async getTransactions() {
    const res = await api.get("/transactions");
    return res.data;
  },

  async getTransactionById(id: string) {
    const res = await api.get(`/transactions/${id}`);
    return res.data;
  },
};
