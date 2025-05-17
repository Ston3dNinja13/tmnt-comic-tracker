import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/cloudflare';
import { getRepositories } from '@/lib/database';
import { findLowestPrice } from '@/lib/price-tracker';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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
    
    // Get lowest price
    const lowestPrice = await repositories.lowestPrices.getLowestPriceForComic(comicId);
    
    // Get price history
    const priceHistory = await repositories.prices.getPricesForComic(comicId);
    
    return NextResponse.json({
      comic,
      lowestPrice,
      priceHistory
    });
  } catch (error) {
    console.error(`Error fetching comic ${comicId}:`, error);
    return NextResponse.json({ error: 'Failed to fetch comic details' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { env } = getCloudflareContext();
  const repositories = getRepositories(env.DB);
  const comicId = parseInt(params.id);
  
  if (isNaN(comicId)) {
    return NextResponse.json({ error: 'Invalid comic ID' }, { status: 400 });
  }
  
  try {
    // Check if comic exists
    const comic = await repositories.comics.getComicById(comicId);
    
    if (!comic) {
      return NextResponse.json({ error: 'Comic not found' }, { status: 404 });
    }
    
    // Find current lowest price
    const lowestPrice = await findLowestPrice(comic.title, comic.issue_number);
    
    // Update lowest price in database
    await repositories.lowestPrices.updateLowestPrice({
      comic_id: comicId,
      ...lowestPrice
    });
    
    // Add price to price history
    await repositories.prices.addPrice({
      comic_id: comicId,
      price: lowestPrice.current_price,
      source: lowestPrice.source,
      url: lowestPrice.url,
      condition: lowestPrice.condition
    });
    
    return NextResponse.json({
      success: true,
      message: 'Comic price updated successfully',
      lowestPrice
    });
  } catch (error) {
    console.error(`Error updating comic ${comicId}:`, error);
    return NextResponse.json({ error: 'Failed to update comic price' }, { status: 500 });
  }
}
