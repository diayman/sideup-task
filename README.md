# Warehouse Inventory Management System

A responsive React application for managing warehouse inventory with real-time stock tracking and efficient big data handling.

## 🚀 Live Demo

**[View Live Demo](https://warehouse-inventory-ten.vercel.app/)**

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v20 or higher)
- npm

### Installation

1. **Clone and install**

   ```bash
   git clone https://github.com/diayman/sideup-task.git
   cd sideup-task
   npm install
   ```

2. **Start development server**

   ```bash
   npm run dev
   ```

3. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📊 Caching Strategy

- **React Query** with 5-minute stale time
- **Background refetching** for fresh data
- **Optimistic updates** for immediate UI feedback
- **Reduced API calls** with cached data display

```typescript
const { data: products } = useQuery({
  queryKey: ["products", category],
  queryFn: () => fetchProductsByCategory(category),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

## 🗄️ Big Data Handling

- **Virtualization** using react-window for efficient rendering
- **50x data simulation** - duplicates API data for large datasets
- **FixedSizeGrid** for predictable performance
- **AutoSizer** for responsive grid layout
- **Only renders visible items** for memory efficiency

```typescript
// Simulates large product list
const simulatedProducts = useMemo(() => {
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
}, [products]);
```

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test ProductList.test.tsx
```

**Test Coverage:**

- Component testing with React Testing Library
- API mocking with Axios
- Context testing with SidebarProvider
- User interactions and error states

## 📱 Responsive Design

**Optimized for all screen sizes:**

- **Mobile**: < 768px - Collapsible sidebar with hamburger menu
- **Tablet**: 768px - 1024px - Adaptive grid layout
- **Desktop**: > 1024px - Full sidebar always visible
- **Mobile-first** approach with smooth animations
- **Responsive grid** that adapts to any screen size

## 🚀 Deployment

**Vercel (Recommended):**

1. Connect GitHub repository to Vercel
2. Automatic React + Vite detection
3. Zero configuration deployment

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Layout.tsx       # Main layout wrapper
│   ├── Sidebar.tsx      # Category navigation
│   ├── ProductList.tsx  # Virtualized product grid
│   ├── ProductCard.tsx  # Individual product display
│   └── LowStockPanel.tsx # Stock alerts
├── context/             # React Context providers
│   └── SidebarContext.tsx # Sidebar state management
├── services/            # API services
│   ├── api.ts           # Base API configuration
│   ├── productService.ts # Product API calls
│   └── categoryService.ts # Category API calls
├── pages/               # Main views
│   └── Dashboard.tsx    # Main dashboard
├── types/               # TypeScript definitions
│   └── product.d.ts     # Product interface
└── __tests__/           # Test files
    └── components/      # Component tests
```

## 🛠️ Built With

- React 19 + TypeScript + Vite
- React Query (caching)
- react-window (virtualization)
- Tailwind CSS (styling)
- React Testing Library (testing)

---

**Made with ❤️ using React + TypeScript + Vite**
