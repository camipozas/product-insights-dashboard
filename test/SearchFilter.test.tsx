import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchFilter from '../src/components/SearchFilter';
import type { ProductSummary } from '@/types/schemas';

const mockProducts: ProductSummary[] = [
  {
    id: 1,
    title: 'iPhone 13 Pro',
    price: 1099.99,
    category: 'smartphones',
    thumbnail: 'https://example.com/iphone.jpg',
  },
  {
    id: 2,
    title: 'Samsung Galaxy S21',
    price: 799.99,
    category: 'smartphones',
    thumbnail: 'https://example.com/galaxy.jpg',
  },
  {
    id: 3,
    title: 'MacBook Pro',
    price: 1999.99,
    category: 'laptops',
    thumbnail: 'https://example.com/macbook.jpg',
  },
  {
    id: 4,
    title: 'Dell XPS 13',
    price: 1299.99,
    category: 'laptops',
    thumbnail: 'https://example.com/dell.jpg',
  },
];

describe('SearchFilter', () => {
  const mockOnFilteredProducts = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all filter controls', () => {
    render(<SearchFilter products={mockProducts} onFilteredProducts={mockOnFilteredProducts} />);

    expect(screen.getByLabelText('Search by product name')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Price Range')).toBeInTheDocument();
    expect(screen.getByText('Apply Filters')).toBeInTheDocument();
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  it('should populate category dropdown with unique categories', () => {
    render(<SearchFilter products={mockProducts} onFilteredProducts={mockOnFilteredProducts} />);

    const categorySelect = screen.getByLabelText('Category');
    expect(categorySelect).toBeInTheDocument();

    expect(screen.getByText('All Categories')).toBeInTheDocument();
    expect(screen.getByText('Smartphones')).toBeInTheDocument();
    expect(screen.getByText('Laptops')).toBeInTheDocument();
  });

  it('should filter products by name search', async () => {
    render(<SearchFilter products={mockProducts} onFilteredProducts={mockOnFilteredProducts} />);

    const searchInput = screen.getByLabelText('Search by product name');
    fireEvent.change(searchInput, { target: { value: 'iPhone' } });
    
    // Click the search button
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockOnFilteredProducts).toHaveBeenCalledWith([
        expect.objectContaining({ title: 'iPhone 13 Pro' }),
      ]);
    });
  });

  it('should filter products by category', async () => {
    render(<SearchFilter products={mockProducts} onFilteredProducts={mockOnFilteredProducts} />);

    const categorySelect = screen.getByLabelText('Category');
    fireEvent.change(categorySelect, { target: { value: 'smartphones' } });

    await waitFor(() => {
      expect(mockOnFilteredProducts).toHaveBeenCalledWith([
        expect.objectContaining({ category: 'smartphones' }),
        expect.objectContaining({ category: 'smartphones' }),
      ]);
    });
  });

  it('should filter products by minimum price', async () => {
    render(<SearchFilter products={mockProducts} onFilteredProducts={mockOnFilteredProducts} />);

    const minPriceInput = screen.getByPlaceholderText('Min price');
    fireEvent.change(minPriceInput, { target: { value: '1000' } });
    
    // Click Apply Filters button
    const applyButton = screen.getByText('Apply Filters');
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(mockOnFilteredProducts).toHaveBeenCalledWith([
        expect.objectContaining({ price: 1099.99 }),
        expect.objectContaining({ price: 1999.99 }),
        expect.objectContaining({ price: 1299.99 }),
      ]);
    });
  });

  it('should filter products by maximum price', async () => {
    render(<SearchFilter products={mockProducts} onFilteredProducts={mockOnFilteredProducts} />);

    const maxPriceInput = screen.getByPlaceholderText('Max price');
    fireEvent.change(maxPriceInput, { target: { value: '1000' } });
    
    // Click Apply Filters button
    const applyButton = screen.getByText('Apply Filters');
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(mockOnFilteredProducts).toHaveBeenCalledWith([
        expect.objectContaining({ price: 799.99 }),
      ]);
    });
  });

  it('should combine multiple filters', async () => {
    render(<SearchFilter products={mockProducts} onFilteredProducts={mockOnFilteredProducts} />);

    const categorySelect = screen.getByLabelText('Category');
    fireEvent.change(categorySelect, { target: { value: 'smartphones' } });

    const minPriceInput = screen.getByPlaceholderText('Min price');
    fireEvent.change(minPriceInput, { target: { value: '800' } });
    
    // Click Apply Filters button
    const applyButton = screen.getByText('Apply Filters');
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(mockOnFilteredProducts).toHaveBeenCalledWith([
        expect.objectContaining({ 
          category: 'smartphones',
          price: 1099.99 
        }),
      ]);
    });
  });

  it('should clear all filters when clear button is clicked', async () => {
    render(<SearchFilter products={mockProducts} onFilteredProducts={mockOnFilteredProducts} />);

    const searchInput = screen.getByLabelText('Search by name');
    const categorySelect = screen.getByLabelText('Category');
    
    fireEvent.change(searchInput, { target: { value: 'iPhone' } });
    fireEvent.change(categorySelect, { target: { value: 'smartphones' } });

    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(searchInput).toHaveValue('');
      expect(categorySelect).toHaveValue('');
      expect(mockOnFilteredProducts).toHaveBeenCalledWith(mockProducts);
    });
  });

  it('should handle empty search term', async () => {
    render(<SearchFilter products={mockProducts} onFilteredProducts={mockOnFilteredProducts} />);

    const searchInput = screen.getByLabelText('Search by name');
    fireEvent.change(searchInput, { target: { value: '' } });

    await waitFor(() => {
      expect(mockOnFilteredProducts).toHaveBeenCalledWith(mockProducts);
    });
  });

  it('should handle invalid price inputs gracefully', async () => {
    render(<SearchFilter products={mockProducts} onFilteredProducts={mockOnFilteredProducts} />);

    const minPriceInput = screen.getByPlaceholderText('Min');
    fireEvent.change(minPriceInput, { target: { value: 'invalid' } });
    
    // Click Apply Filters button
    const applyButton = screen.getByText('Apply Filters');
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(mockOnFilteredProducts).toHaveBeenCalledWith(mockProducts);
    });
  });

  it('should trigger search on Enter key press', async () => {
    render(<SearchFilter products={mockProducts} onFilteredProducts={mockOnFilteredProducts} />);

    const searchInput = screen.getByLabelText('Search by name');
    fireEvent.change(searchInput, { target: { value: 'iPhone' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(mockOnFilteredProducts).toHaveBeenCalledWith([
        expect.objectContaining({ title: 'iPhone 13 Pro' }),
      ]);
    });
  });

  it('should render search icon button', () => {
    render(<SearchFilter products={mockProducts} onFilteredProducts={mockOnFilteredProducts} />);

    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toBeInTheDocument();
  });
});
