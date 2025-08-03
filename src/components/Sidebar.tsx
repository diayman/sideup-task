import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useSidebar } from "../context/SidebarContext";
import { categoryService } from "../services/categoryService";

type SidebarProps = {
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
};

const fetchCategories = async () => {
  return await categoryService.getAll();
};

const Sidebar: React.FC<SidebarProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  const { isSidebarOpen, closeSidebar } = useSidebar();

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

  const handleCategorySelect = (category: string) => {
    onSelectCategory(category);
    // Hide sidebar on mobile after selection
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  };

  const handleCloseSidebar = () => {
    closeSidebar();
  };

  const SidebarContent = () => {
    if (isLoading)
      return (
        <div className="text-center pt-16 h-full flex items-start justify-center text-gray-200 text-xl font-bold bg-gray-900 px-4">
          Loading...
        </div>
      );
    if (error)
      return (
        <div className="p-4 text-red-500 text-sm sm:text-base">
          Failed to load categories
        </div>
      );

    return (
      <div className="w-full h-full bg-gray-900 p-2 md:p-4 text-white overflow-y-auto">
        <div className="flex items-center justify-between mb-2 sm:mb-4 px-2 sm:px-0">
          <h2 className="text-md lg:text-lg font-bold">Warehouse Inventory</h2>
          {/* Close button for mobile */}
          <button
            onClick={handleCloseSidebar}
            className="md:hidden text-gray-400 hover:text-white p-1"
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
        <ul className="space-y-1 sm:space-y-2">
          {formattedCategories.map((formattedCat, index) => {
            const originalCat = categories![index];

            return (
              <li
                key={originalCat}
                onClick={() => handleCategorySelect(originalCat)}
                className={`rounded px-2 py-1.5 sm:py-1 cursor-pointer text-sm sm:text-base transition-colors duration-200 ${
                  selectedCategory === originalCat
                    ? "bg-gray-800 text-white"
                    : "hover:bg-gray-800 text-gray-200 hover:text-white"
                }`}
              >
                {formattedCat}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <>
      {/* Mobile sidebar - slides in from left */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-64 max-w-[80vw] bg-gray-900 shadow-xl transition-transform duration-300 ease-in-out z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>

      {/* Desktop sidebar - always visible */}
      <aside className="hidden md:block w-full h-full bg-gray-900 text-white p-2 md:p-0 overflow-y-auto">
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
