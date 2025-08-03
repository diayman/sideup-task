import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "../types/product";
import ProductCard from "./ProductCard";
import { FixedSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { useSidebar } from "../context/SidebarContext";
import { productService } from "../services/productService";

type ProductListProps = {
  category: string;
  onLowStockChange: (lowStock: { product: Product; stock: number }[]) => void;
};

const fetchProductsByCategory = async (category: string) => {
  return await productService.getByCategory(category);
};

const ENABLE_SIMULATION = true;

const ProductList: React.FC<ProductListProps> = ({
  category,
  onLowStockChange,
}) => {
  const { toggleSidebar } = useSidebar();
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", category],
    queryFn: () => fetchProductsByCategory(category),
    staleTime: 5 * 60 * 1000,
  });

  const stockMapByCategory = useRef<Map<string, Record<number, number>>>(
    new Map()
  );
  const [stockMap, setStockMap] = useState<Record<number, number>>({});

  // Simulate large product list
  const simulatedProducts = useMemo(() => {
    if (!products) return [];
    if (!ENABLE_SIMULATION) return products;

    const largeList: Product[] = [];
    for (let i = 0; i < 50; i++) {
      products.forEach((product) => {
        largeList.push({
          ...product,
          id: Number(`${product.id}${i}`),
          title: `${product.title} (Copy ${i + 1})`,
        });
      });
    }
    return largeList;
  }, [products, ENABLE_SIMULATION]);

  useEffect(() => {
    if (simulatedProducts.length > 0) {
      const existingStock = stockMapByCategory.current.get(category);
      if (existingStock) {
        setStockMap(existingStock);
      } else {
        const initialStock: Record<number, number> = {};
        simulatedProducts.forEach((product) => {
          initialStock[product.id] = Math.floor(Math.random() * 20) + 1;
        });
        stockMapByCategory.current.set(category, initialStock);
        setStockMap(initialStock);
      }
    }
  }, [simulatedProducts, category]);

  useEffect(() => {
    if (simulatedProducts.length > 0) {
      const lowStock = simulatedProducts
        .filter(
          (product) =>
            stockMap[product.id] !== undefined && stockMap[product.id] < 5
        )
        .map((product) => ({
          product: product,
          stock: stockMap[product.id],
        }));
      onLowStockChange(lowStock);
    }
  }, [stockMap, simulatedProducts, onLowStockChange]);

  const handleDecrease = (productId: number) => {
    setStockMap((prev) => {
      const updated = {
        ...prev,
        [productId]: Math.max(0, (prev[productId] ?? 0) - 1),
      };
      stockMapByCategory.current.set(category, updated);
      return updated;
    });
  };

  if (isLoading)
    return (
      <div className="text-2xl font-bold text-gray-500 h-full flex items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="text-2xl font-bold text-red-500 h-full flex items-center justify-center">
        Error loading products.
      </div>
    );

  return (
    <div className="h-full w-full overflow-hidden pb-12">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg md:text-2xl font-bold text-gray-700 capitalize">
          {category}
        </h2>
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      <AutoSizer>
        {({ height, width }) => {
          const CARD_WIDTH = 250; // min product card width
          const CARD_HEIGHT = 350;
          const columnCount = Math.floor(width / CARD_WIDTH) || 1;
          const rowCount = Math.ceil(simulatedProducts.length / columnCount);
          const adjustedCardWidth = width / columnCount;

          return (
            <Grid
              columnCount={columnCount}
              columnWidth={adjustedCardWidth}
              height={height}
              rowCount={rowCount}
              rowHeight={CARD_HEIGHT}
              width={width}
            >
              {({ columnIndex, rowIndex, style }) => {
                const index = rowIndex * columnCount + columnIndex;
                const product = simulatedProducts[index];
                if (!product) return null;

                return (
                  <div style={style} className="p-2">
                    <ProductCard
                      product={product}
                      stock={stockMap[product.id] ?? 0}
                      onDecrease={() => handleDecrease(product.id)}
                    />
                  </div>
                );
              }}
            </Grid>
          );
        }}
      </AutoSizer>
    </div>
  );
};

export default ProductList;
