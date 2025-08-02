import { memo } from "react";
import type { Product } from "../types/product";

type Props = {
  product: Product;
  stock: number;
  onDecrease: () => void;
};

const ProductCard: React.FC<Props> = ({ product, stock, onDecrease }) => {
  const stockColor =
    stock === 0
      ? "bg-red-200 text-red-700"
      : stock < 5
      ? "bg-orange-200 text-orange-700"
      : "bg-green-200 text-green-700";

  return (
    <div className="p-4 mx-2  rounded shadow border bg-white">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-40 object-contain mb-2"
      />
      <h3 className="font-semibold text-sm mb-1 truncate">{product.title}</h3>
      <p className="text-xs text-gray-500 italic mb-1">
        Category: {product.category}
      </p>
      <p className="text-sm text-gray-600 mb-1">${product.price.toFixed(2)}</p>
      <span className={`text-xs px-2 py-1 rounded ${stockColor}`}>
        Stock: {stock}
      </span>
      <button
        className="mt-2 block w-full bg-gray-200 hover:bg-gray-300 text-sm py-1 rounded"
        onClick={onDecrease}
      >
        Decrease Stock
      </button>
    </div>
  );
};

export default memo(ProductCard);
