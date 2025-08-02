import React, { useCallback, useState } from "react";
import Layout from "../components/Layout";
import ProductList from "../components/ProductList";
import LowStockPanel from "../components/LowStockPanel";
import type { Product } from "../types/product";

const Dashboard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [lowStockProducts, setLowStockProducts] = useState<
    { product: Product; stock: number }[]
  >([]);

  const handleLowStockChange = useCallback(
    (lowStock: { product: Product; stock: number }[]) => {
      setLowStockProducts(lowStock);
    },
    [setLowStockProducts]
  );

  return (
    <Layout
      selectedCategory={selectedCategory}
      onSelectCategory={setSelectedCategory}
      rightPanel={<LowStockPanel lowStockProducts={lowStockProducts} />}
    >
      {selectedCategory && (
        <ProductList
          category={selectedCategory}
          onLowStockChange={handleLowStockChange}
        />
      )}
    </Layout>
  );
};

export default Dashboard;
