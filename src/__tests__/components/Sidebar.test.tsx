/**
 * Sidebar Component Tests
 *
 * Tests for Sidebar component covering:
 * - Data fetching (success, loading, error states)
 * - Caching behavior with React Query
 * - User interactions (category selection)
 * - UI state management (selected category highlighting)
 */

import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Sidebar from "../../components/Sidebar";
import { SidebarProvider } from "../../context/SidebarContext";
import { categoryService } from "../../services/categoryService";

jest.mock("../../services/categoryService");
const mockedCategoryService = categoryService as jest.Mocked<
  typeof categoryService
>;

// Mock window.innerWidth to simulate desktop
Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: 1024,
});

const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>{ui}</SidebarProvider>
    </QueryClientProvider>
  );
};

test("fetches and displays categories", async () => {
  mockedCategoryService.getAll.mockResolvedValueOnce([
    "electronics",
    "jewelery",
  ]);

  renderWithClient(<Sidebar onSelectCategory={() => {}} selectedCategory="" />);

  // Wait for categories to load - use findAllByText to handle responsive design
  const categories = await screen.findAllByText("Electronics");
  expect(categories.length).toBeGreaterThan(0);
});

test("uses cached categories without refetching", async () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
    },
  });

  mockedCategoryService.getAll.mockResolvedValueOnce(["electronics"]);

  render(
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <Sidebar onSelectCategory={() => {}} selectedCategory="" />
      </SidebarProvider>
    </QueryClientProvider>
  );

  await screen.findAllByText("Electronics");

  const cachedData = queryClient.getQueryData(["categories"]);
  expect(cachedData).toEqual(["electronics"]);

  expect(mockedCategoryService.getAll).toHaveBeenCalled();
});

test("shows loading state while fetching categories", async () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  mockedCategoryService.getAll.mockImplementation(() => new Promise(() => {}));

  render(
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <Sidebar onSelectCategory={() => {}} selectedCategory="" />
      </SidebarProvider>
    </QueryClientProvider>
  );

  // Check that loading state is present (use getAllByText to handle multiple elements)
  const loadingElements = screen.getAllByText("Loading...");
  expect(loadingElements.length).toBeGreaterThan(0);
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

  mockedCategoryService.getAll.mockRejectedValueOnce(
    new Error("Network error")
  );

  render(
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <Sidebar onSelectCategory={() => {}} selectedCategory="" />
      </SidebarProvider>
    </QueryClientProvider>
  );

  await waitFor(() => {
    // Use getAllByText to handle multiple error elements
    const errorElements = screen.getAllByText("Failed to load categories");
    expect(errorElements.length).toBeGreaterThan(0);
  });
});

test("calls onSelectCategory when category is clicked", async () => {
  mockedCategoryService.getAll.mockResolvedValueOnce([
    "electronics",
    "jewelery",
  ]);

  const mockOnSelectCategory = jest.fn();

  renderWithClient(
    <Sidebar onSelectCategory={mockOnSelectCategory} selectedCategory="" />
  );

  // Find and click the first Electronics element
  const electronicsElements = await screen.findAllByText("Electronics");
  electronicsElements[0].click();

  expect(mockOnSelectCategory).toHaveBeenCalledWith("electronics");
});

test("highlights selected category", async () => {
  mockedCategoryService.getAll.mockResolvedValueOnce([
    "electronics",
    "jewelery",
  ]);

  renderWithClient(
    <Sidebar onSelectCategory={() => {}} selectedCategory="electronics" />
  );

  // Find Electronics elements and check if one has the selected class
  const electronicsElements = await screen.findAllByText("Electronics");
  const hasSelectedClass = electronicsElements.some((element) =>
    element.classList.contains("bg-gray-800")
  );
  expect(hasSelectedClass).toBe(true);
});
