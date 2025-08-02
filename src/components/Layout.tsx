import React from "react";
import Sidebar from "./Sidebar";

type LayoutProps = {
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
};

const Layout: React.FC<LayoutProps> = ({
  children,
  rightPanel,
  onSelectCategory,
  selectedCategory,
}) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-1/5">
        <Sidebar
          onSelectCategory={onSelectCategory}
          selectedCategory={selectedCategory}
        />
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>

      {rightPanel && (
        <aside className="w-1/5 bg-yellow-50 p-4 border-l">{rightPanel}</aside>
      )}
    </div>
  );
};

export default Layout;
