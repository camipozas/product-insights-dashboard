import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * Health check endpoint
 * @returns Health status
 */
export async function GET() {
  logger.debug('Health check requested');

  return NextResponse.json(
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'product-insights-dashboard',
    },
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    }
  );
}
