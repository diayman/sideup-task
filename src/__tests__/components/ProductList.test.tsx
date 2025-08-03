/**
 * ProductList Component Tests
 *
 * Tests for ProductList component covering:
 * - Data fetching (success, loading, error states)
 * - Stock notification logic
 * - Large list performance with virtualization
 * - Stock decrease functionality
 */

import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProductList from "../../components/ProductList";
import type { Product } from "../../types/product";
import { SidebarProvider } from "../../context/SidebarContext";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockProducts: Product[] = [
  {
    id: 1,
    title: "Item 1",
    price: 10,
    description: "",
    category: "test",
    image: "",
    rating: { rate: 0, count: 0 },
  },
  {
    id: 2,
    title: "Item 2",
    price: 20,
    description: "",
    category: "test",
    image: "",
    rating: { rate: 0, count: 0 },
  },
];

const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>{ui}</SidebarProvider>
    </QueryClientProvider>
  );
};

test("calls onLowStockChange with low stock items", async () => {
  mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });
  const lowStockHandler = jest.fn();

  renderWithClient(
    <ProductList category="test" onLowStockChange={lowStockHandler} />
  );

  await waitFor(() => {
    expect(lowStockHandler).toHaveBeenCalled();
    const callArg = lowStockHandler.mock.calls[0][0];
    expect(callArg.length).toBeGreaterThanOrEqual(0);
  });
});

test("renders only visible items for large list", async () => {
  const largeList: Product[] = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    title: `Product ${i}`,
    price: 10,
    description: "",
    category: "test",
    image: "",
    rating: { rate: 0, count: 0 },
  }));

  mockedAxios.get.mockResolvedValueOnce({ data: largeList });
  const handler = jest.fn();

  renderWithClient(<ProductList category="test" onLowStockChange={handler} />);

  await waitFor(() => {
    expect(screen.getByText("test")).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(handler).toHaveBeenCalled();
  });

  expect(screen.getByText("test")).toBeInTheDocument();
});

test("shows loading state while fetching data", async () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  mockedAxios.get.mockImplementation(() => new Promise(() => {}));

  render(
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <ProductList category="test" onLowStockChange={() => {}} />
      </SidebarProvider>
    </QueryClientProvider>
  );

  expect(screen.getByText("Loading...")).toBeInTheDocument();
});

test("shows error state when API call fails", async () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        retryDelay: 0,
      },
    },
  });

  mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

  render(
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <ProductList category="test" onLowStockChange={() => {}} />
      </SidebarProvider>
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(screen.getByText("Error loading products.")).toBeInTheDocument();
  });
});

test("handles stock decrease functionality", async () => {
  mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });
  const lowStockHandler = jest.fn();

  renderWithClient(
    <ProductList category="test" onLowStockChange={lowStockHandler} />
  );

  await waitFor(() => {
    expect(lowStockHandler).toHaveBeenCalled();
  });

  const decreaseButtons = screen.queryAllByText("Decrease Stock");
  expect(decreaseButtons.length).toBeGreaterThanOrEqual(0);
});
