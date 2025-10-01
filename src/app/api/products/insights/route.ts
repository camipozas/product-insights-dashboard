import { NextResponse } from 'next/server';
import { ProductInsightsSchema } from '@/types/schemas';
import type { ProductInsights } from '@/types/schemas';
import { fetchAllProducts } from '@/lib/dummyjson';

/**
 * Get the insights for the products
 * @returns The insights
 */
export async function GET() {
  try {
    const products = await fetchAllProducts();

    const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
    const averagePrice = Math.round((totalPrice / products.length) * 100) / 100;

    const categoryCount: Record<string, number> = {};
    products.forEach((product) => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });

    const topCategory = Object.entries(categoryCount).reduce(
      (top, [category, count]) => (count > (categoryCount[top] || 0) ? category : top),
      ''
    );

    const insights: ProductInsights = {
      averagePrice,
      topCategory,
      totalProducts: products.length,
      categoryCount,
    };
    
    const validatedInsights = ProductInsightsSchema.parse(insights);

    return NextResponse.json(validatedInsights, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Error calculating insights:', error);
    return NextResponse.json(
      {
        error: 'Failed to calculate insights',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}