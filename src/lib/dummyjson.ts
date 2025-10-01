import { DummyJSONProductsResponseSchema } from '@/types/schemas';
import type { Product } from '@/types/schemas';

const DUMMYJSON_API = 'https://dummyjson.com/products';
const PAGE_SIZE = 30;
const CACHE_REVALIDATE = 3600; // 1 hour

/**
 * Fetch all products from DummyJSON using automatic pagination
 * This approach is scalable and works regardless of dataset size
 *
 * @returns Promise with all products
 * @throws Error if API fails or returns invalid data
 */
export async function fetchAllProducts(): Promise<Product[]> {
  const allProducts: Product[] = [];

  const firstResponse = await fetch(`${DUMMYJSON_API}?limit=${PAGE_SIZE}&skip=0`, {
    next: { revalidate: CACHE_REVALIDATE },
  });

  if (!firstResponse.ok) {
    throw new Error(`DummyJSON API returned ${firstResponse.status}`);
  }

  const firstData = (await firstResponse.json()) as unknown;
  const firstValidation = DummyJSONProductsResponseSchema.safeParse(firstData);

  if (!firstValidation.success) {
    console.error('Invalid data from DummyJSON:', firstValidation.error);
    throw new Error('Invalid data received from external API');
  }

  const { total, products: firstPageProducts } = firstValidation.data;
  allProducts.push(...firstPageProducts);

  const remainingItems = total - PAGE_SIZE;
  if (remainingItems <= 0) {
    return allProducts;
  }

  const remainingPages = Math.ceil(remainingItems / PAGE_SIZE);

  const pagePromises = Array.from({ length: remainingPages }, (_, i) => {
    const pageSkip = (i + 1) * PAGE_SIZE;
    return fetch(`${DUMMYJSON_API}?limit=${PAGE_SIZE}&skip=${pageSkip}`, {
      next: { revalidate: CACHE_REVALIDATE },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`DummyJSON API returned ${response.status} for page ${i + 2}`);
        }

        const data = (await response.json()) as unknown;
        const validation = DummyJSONProductsResponseSchema.safeParse(data);

        if (!validation.success) {
          console.error(`Invalid paginated data from DummyJSON (page ${i + 2}):`, validation.error);
          return [];
        }

        return validation.data.products;
      })
      .catch((error) => {
        console.error(`Error fetching page ${i + 2}:`, error);
        return [];
      });
  });

  const pagesResults = await Promise.all(pagePromises);

  pagesResults.forEach((pageProducts) => {
    allProducts.push(...pageProducts);
  });

  return allProducts;
}

/**
 * Fetch a single product by ID from DummyJSON
 *
 * @param id - Product ID
 * @returns Promise with product data
 * @throws Error if product not found or API fails
 */
export async function fetchProductById(id: number): Promise<Product> {
  const response = await fetch(`${DUMMYJSON_API}/${id}`, {
    next: { revalidate: CACHE_REVALIDATE },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Product with ID ${id} not found`);
    }
    throw new Error(`DummyJSON API returned ${response.status}`);
  }

  const rawProduct = (await response.json()) as unknown;
  const validation = DummyJSONProductsResponseSchema.shape.products.element.safeParse(rawProduct);

  if (!validation.success) {
    console.error('Invalid product data from DummyJSON:', validation.error);
    throw new Error('Invalid data received from external API');
  }

  return validation.data;
}
