'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ProductSummary } from '@/types/schemas';

interface SearchFilterProps {
  products: ProductSummary[];
  onFilteredProducts: (filteredProducts: ProductSummary[]) => void;
}

export default function SearchFilter({ products, onFilteredProducts }: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const categories = Array.from(new Set(products.map(product => product.category))).sort();

  const filterProducts = useCallback(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (priceRange.min) {
      const minPrice = parseFloat(priceRange.min);
      if (!isNaN(minPrice)) {
        filtered = filtered.filter(product => product.price >= minPrice);
      }
    }

    if (priceRange.max) {
      const maxPrice = parseFloat(priceRange.max);
      if (!isNaN(maxPrice)) {
        filtered = filtered.filter(product => product.price <= maxPrice);
      }
    }

    onFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange.min, priceRange.max, onFilteredProducts]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    onFilteredProducts(products);
  };

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  return (
    <div className="search-filter bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Search & Filter Products</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search by name */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search by name
          </label>
          <input
            id="search"
            type="text"
            placeholder="Enter product name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              filterProducts();
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              filterProducts();
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Min price */}
        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Min Price ($)
          </label>
          <input
            id="minPrice"
            type="number"
            placeholder="0"
            value={priceRange.min}
            onChange={(e) => {
              setPriceRange({ ...priceRange, min: e.target.value });
              filterProducts();
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Max price */}
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Max Price ($)
          </label>
          <input
            id="maxPrice"
            type="number"
            placeholder="1000"
            value={priceRange.max}
            onChange={(e) => {
              setPriceRange({ ...priceRange, max: e.target.value });
              filterProducts();
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Clear filters button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
