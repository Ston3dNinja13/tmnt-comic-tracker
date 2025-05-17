import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/cloudflare';
import { getRepositories } from '@/lib/database';

export interface PriceHistoryResponse {
  comicId: number;
  title: string;
  issueNumber: number;
  priceHistory: {
    date: string;
    price: number;
    source: string;
    condition?: string;
    url?: string;
  }[];
  currentLowestPrice: {
    price: number;
    source: string;
    condition?: string;
    url?: string;
    date: string;
  };
  previousLowestPrice?: {
    price: number;
    source: string;
    condition?: string;
    url?: string;
    date: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { env } = getCloudflareContext();
  const repositories = getRepositories(env.DB);
  const comicId = parseInt(params.id);
  
  if (isNaN(comicId)) {
    return NextResponse.json({ error: 'Invalid comic ID' }, { status: 400 });
  }
  
  try {
    // Get comic details
    const comic = await repositories.comics.getComicById(comicId);
    
    if (!comic) {
      return NextResponse.json({ error: 'Comic not found' }, { status: 404 });
    }
    
    // Get price history
    const priceHistory = await repositories.prices.getPricesForComic(comicId);
    
    // Get lowest price
    const lowestPrice = await repositories.lowestPrices.getLowestPriceForComic(comicId);
    
    if (!lowestPrice) {
      return NextResponse.json({ error: 'No price data available' }, { status: 404 });
    }
    
    const response: PriceHistoryResponse = {
      comicId,
      title: comic.title,
      issueNumber: comic.issue_number,
      priceHistory: priceHistory.map(p => ({
        date: p.date_checked,
        price: p.price,
        source: p.source,
        condition: p.condition,
        url: p.url
      })),
      currentLowestPrice: {
        price: lowestPrice.current_price,
        source: lowestPrice.source,
        condition: lowestPrice.condition,
        url: lowestPrice.url,
        date: lowestPrice.current_price_date
      }
    };
    
    // Add previous lowest price if available
    if (lowestPrice.previous_price && lowestPrice.previous_price_date) {
      response.previousLowestPrice = {
        price: lowestPrice.previous_price,
        source: lowestPrice.source, // We don't store previous source separately
        condition: lowestPrice.condition, // We don't store previous condition separately
        url: lowestPrice.url, // We don't store previous URL separately
        date: lowestPrice.previous_price_date
      };
    }
    
    return NextResponse.json(response);
  } catch (error) {
    console.error(`Error fetching price history for comic ${comicId}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch price history' },
      { status: 500 }
    );
  }
}
