import { useState } from "react";
import type { Product } from "../types/product";

type Props = {
  lowStockProducts: { product: Product; stock: number }[];
};

const LowStockPanel: React.FC<Props> = ({ lowStockProducts }) => {
  const [isVisible, setIsVisible] = useState(false);

  const PanelContent = () => {
    return (
      <div className="w-full h-full bg-red-50 p-2 border-l border-red-200 min-w-[200px]">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-red-600 font-bold">Low Stock</h2>
          {/* Close button for mobile */}
          <button
            onClick={() => setIsVisible(false)}
            className="md:hidden text-red-400 hover:text-red-600 p-1"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {lowStockProducts.length === 0 ? (
          <p className="text-sm text-gray-500">No low stock items</p>
        ) : (
          <ul className="space-y-2 max-h-[90%] md:max-h-[95%] p-2 overflow-auto">
            {lowStockProducts.map(({ product, stock }) => (
              <li
                key={product.id}
                className="flex items-center space-x-2 shadow-sm p-3 bg-white rounded"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-10 h-10 object-contain bg-gray-100 p-2 rounded-sm"
                />
                <span className="text-sm truncate">{product.title}</span>
                <span className="text-xs text-gray-500">- {stock}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Toggle button for mobile - shows notification badge */}
      <button
        onClick={() => setIsVisible(true)}
        className="md:hidden fixed bottom-4 right-4 z-50 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-110"
      >
        <div className="relative">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          {/* Notification badge */}
          {lowStockProducts.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {lowStockProducts.length}
            </span>
          )}
        </div>
      </button>

      {/* Mobile panel - slides up from bottom */}
      {isVisible && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsVisible(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 h-96 bg-red-50 rounded-t-lg shadow-xl">
            <PanelContent />
          </div>
        </div>
      )}

      {/* Desktop panel - always visible */}
      <div className="hidden md:block w-full h-full">
        <PanelContent />
      </div>
    </>
  );
};

export default LowStockPanel;
