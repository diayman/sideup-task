import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useMemo } from "react";

type SidebarProps = {
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
};

const fetchCategories = async () => {
  const { data } = await axios.get<string[]>(
    "https://fakestoreapi.com/products/categories"
  );
  return data;
};

const Sidebar: React.FC<SidebarProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes caching
  });

  const formattedCategories = useMemo(() => {
    return (categories || []).map(
      (cat) => cat.charAt(0).toUpperCase() + cat.slice(1)
    );
  }, [categories]);

  useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategory) {
      onSelectCategory(categories[0]);
    }
  }, [categories, selectedCategory, onSelectCategory]);

  if (isLoading)
    return (
      <div className="text-center pt-8 h-full flex items-start justify-center text-gray-200 text-2xl font-bold bg-gray-900">
        Loading...
      </div>
    );
  if (error)
    return <div className="p-4 text-red-500">Failed to load categories</div>;

  return (
    <aside className="w-full h-full bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Warehouse Inventory</h2>
      <ul className="space-y-2">
        {formattedCategories.map((formattedCat, index) => {
          const originalCat = categories![index];

          return (
            <li
              key={originalCat}
              onClick={() => onSelectCategory(originalCat)}
              className={`rounded px-2 py-1 cursor-pointer ${
                selectedCategory === originalCat
                  ? "bg-gray-800"
                  : "hover:bg-gray-800"
              }`}
            >
              {formattedCat}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
