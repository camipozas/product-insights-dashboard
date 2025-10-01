import { NextResponse } from 'next/server';
import { ProductSummarySchema } from '@/types/schemas';
import type { ProductSummary } from '@/types/schemas';
import { fetchAllProducts } from '@/lib/dummyjson';

/**
 * Get the products for the dashboard
 * @returns The products
 */
export async function GET() {
  try {
    const products = await fetchAllProducts();

    const trimmedProducts: ProductSummary[] = products.map((product) => 
      ProductSummarySchema.parse({
        id: product.id,
        title: product.title,
        price: product.price,
        category: product.category,
        thumbnail: product.thumbnail,
      })
    );

    return NextResponse.json(
      { products: trimmedProducts, total: products.length },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}