import api from "../api/axios";

export const getTopProducts = async () => {
  const res = await api.get("/products/top"); // /api/products/top değil!
  return res.data;
};

export const getAllProducts = async () => {
  const res = await api.get("/products"); // /api/products değil!
  return res.data;
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`); // /api/products/${id} değil!
  return res.data;
};
export const placeOrder = async (cartItems) => {
  const res = await api.post("/api/orders/checkout", cartItems);
  return res.data;
};