import type { Product } from "../types/product";

type Props = {
  lowStockProducts: { product: Product; stock: number }[];
};

const LowStockPanel: React.FC<Props> = ({ lowStockProducts }) => {
  return (
    <div className="bg-red-50 p-2 border-l border-red-200 min-w-[200px]">
      <h2 className="text-red-600 font-bold mb-2">Low Stock</h2>
      {lowStockProducts.length === 0 ? (
        <p className="text-sm text-gray-500">No low stock items</p>
      ) : (
        <ul className="space-y-2 max-h-[800px] p-2 overflow-auto">
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

export default LowStockPanel;
