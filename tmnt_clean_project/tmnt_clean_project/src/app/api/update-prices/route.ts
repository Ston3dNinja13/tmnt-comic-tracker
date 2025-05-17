import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/cloudflare';
import { getRepositories } from '@/lib/database';
import { findLowestPrice } from '@/lib/price-tracker';

export async function POST(request: NextRequest) {
  const { env } = getCloudflareContext();
  const repositories = getRepositories(env.DB);
  
  try {
    // Get all comics
    const comics = await repositories.comics.getAllComics();
    
    // Update prices for all comics
    const updates = await Promise.all(comics.map(async (comic) => {
      try {
        // Find current lowest price
        const lowestPrice = await findLowestPrice(comic.title, comic.issue_number);
        
        // Update lowest price in database
        await repositories.lowestPrices.updateLowestPrice({
          comic_id: comic.id,
          ...lowestPrice
        });
        
        // Add price to price history
        await repositories.prices.addPrice({
          comic_id: comic.id,
          price: lowestPrice.current_price,
          source: lowestPrice.source,
          url: lowestPrice.url,
          condition: lowestPrice.condition
        });
        
        return {
          comicId: comic.id,
          title: comic.title,
          issueNumber: comic.issue_number,
          success: true,
          lowestPrice
        };
      } catch (error) {
        console.error(`Error updating price for comic ${comic.id}:`, error);
        return {
          comicId: comic.id,
          title: comic.title,
          issueNumber: comic.issue_number,
          success: false,
          error: 'Failed to update price'
        };
      }
    }));
    
    return NextResponse.json({
      success: true,
      message: 'Price update completed',
      updates
    });
  } catch (error) {
    console.error('Error updating prices:', error);
    return NextResponse.json({ error: 'Failed to update prices' }, { status: 500 });
  }
}
