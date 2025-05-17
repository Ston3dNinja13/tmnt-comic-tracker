import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/cloudflare';
import { getRepositories } from '@/lib/database';

export async function GET(request: NextRequest) {
  const { env } = getCloudflareContext();
  const repositories = getRepositories(env.DB);
  
  try {
    const lowestPrices = await repositories.lowestPrices.getLowestPricesForAllComics();
    return NextResponse.json({ lowestPrices });
  } catch (error) {
    console.error('Error fetching lowest prices:', error);
    return NextResponse.json({ error: 'Failed to fetch lowest prices' }, { status: 500 });
  }
}
