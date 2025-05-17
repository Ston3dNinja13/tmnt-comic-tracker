import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/cloudflare';
import { getRepositories } from '@/lib/database';
import { findLowestPrice } from '@/lib/price-tracker';

export async function GET(request: NextRequest) {
  const { env } = getCloudflareContext();
  const repositories = getRepositories(env.DB);
  
  try {
    const comics = await repositories.comics.getAllComics();
    return NextResponse.json({ comics });
  } catch (error) {
    console.error('Error fetching comics:', error);
    return NextResponse.json({ error: 'Failed to fetch comics' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { env } = getCloudflareContext();
  const repositories = getRepositories(env.DB);
  
  try {
    const data = await request.json();
    const { title, issue_number, series, publisher, year, description, image_url } = data;
    
    // Validate required fields
    if (!title || !issue_number || !series || !publisher || !year) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Add comic to database
    const comicId = await repositories.comics.addComic({
      title,
      issue_number,
      series,
      publisher,
      year,
      description,
      image_url
    });
    
    // Find initial lowest price
    const lowestPrice = await findLowestPrice(title, issue_number);
    
    // Save lowest price to database
    await repositories.lowestPrices.updateLowestPrice({
      comic_id: comicId,
      ...lowestPrice
    });
    
    return NextResponse.json({ 
      success: true, 
      comicId,
      message: 'Comic added successfully and initial price check completed'
    });
  } catch (error) {
    console.error('Error adding comic:', error);
    return NextResponse.json({ error: 'Failed to add comic' }, { status: 500 });
  }
}
