import api from "./api";
import type { Product } from "../types/product";

export const productService = {
  // Get products by category
  getByCategory: async (category: string): Promise<Product[]> => {
    const { data } = await api.get<Product[]>(`/products/category/${category}`);
    return data;
  },

  // Get all products
  getAll: async (): Promise<Product[]> => {
    const { data } = await api.get<Product[]>("/products");
    return data;
  },
};
