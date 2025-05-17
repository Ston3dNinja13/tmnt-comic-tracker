import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ComicList from '@/components/ComicList';
import { getCloudflareContext } from '@/lib/cloudflare';
import { getRepositories } from '@/lib/database';

export const dynamic = 'force-dynamic';

async function getComicsWithPrices() {
  const { env } = getCloudflareContext();
  const repositories = getRepositories(env.DB);
  
  // Get all comics
  const comics = await repositories.comics.getAllComics();
  
  // Get lowest prices for all comics
  const lowestPrices = await repositories.lowestPrices.getLowestPricesForAllComics();
  
  // Combine comics with their lowest prices
  return comics.map(comic => {
    const lowestPrice = lowestPrices.find(price => price.comic_id === comic.id);
    return {
      ...comic,
      lowestPrice: lowestPrice || {
        id: 0,
        comic_id: comic.id,
        current_price: 0,
        source: 'Unknown',
        date_updated: new Date().toISOString(),
        current_price_date: new Date().toISOString()
      }
    };
  });
}

export default async function Home() {
  const comics = await getComicsWithPrices();
  
  const handleAddComic = async (comicData) => {
    'use server';
    
    const { env } = getCloudflareContext();
    const repositories = getRepositories(env.DB);
    
    // Add comic to database
    const comicId = await repositories.comics.addComic(comicData);
    
    // Redirect to home page to see updated list
    return { success: true, comicId };
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <ComicList 
          comics={comics} 
          onAddComic={handleAddComic} 
        />
      </main>
      
      <Footer />
    </div>
  );
}
