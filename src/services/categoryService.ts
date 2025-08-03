import api from "./api";

export const categoryService = {
  // Get all categories
  getAll: async (): Promise<string[]> => {
    const { data } = await api.get<string[]>("/products/categories");
    return data;
  },
};
