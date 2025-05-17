import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getCloudflareContext } from '@/lib/cloudflare';
import { getRepositories } from '@/lib/database';
import { PriceHistoryResponse } from '@/app/api/comics/[id]/price-history/route';
import PriceHistoryChart from '@/components/PriceHistoryChart';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getComicDetails(id: number) {
  const { env } = getCloudflareContext();
  const repositories = getRepositories(env.DB);
  
  // Get comic details
  const comic = await repositories.comics.getComicById(id);
  
  if (!comic) {
    return null;
  }
  
  // Get lowest price
  const lowestPrice = await repositories.lowestPrices.getLowestPriceForComic(id);
  
  // Get price history
  const priceHistory = await repositories.prices.getPricesForComic(id);
  
  // Format data for price history chart
  const priceHistoryData: PriceHistoryResponse = {
    comicId: id,
    title: comic.title,
    issueNumber: comic.issue_number,
    priceHistory: priceHistory.map(p => ({
      date: p.date_checked,
      price: p.price,
      source: p.source,
      condition: p.condition,
      url: p.url
    })),
    currentLowestPrice: lowestPrice ? {
      price: lowestPrice.current_price,
      source: lowestPrice.source,
      condition: lowestPrice.condition,
      url: lowestPrice.url,
      date: lowestPrice.current_price_date
    } : {
      price: 0,
      source: 'Unknown',
      date: new Date().toISOString()
    }
  };
  
  // Add previous lowest price if available
  if (lowestPrice?.previous_price && lowestPrice?.previous_price_date) {
    priceHistoryData.previousLowestPrice = {
      price: lowestPrice.previous_price,
      source: lowestPrice.source,
      condition: lowestPrice.condition,
      url: lowestPrice.url,
      date: lowestPrice.previous_price_date
    };
  }
  
  return {
    comic,
    lowestPrice,
    priceHistoryData
  };
}

export default async function ComicDetailPage({ params }: { params: { id: string } }) {
  const comicId = parseInt(params.id);
  const comicDetails = await getComicDetails(comicId);
  
  if (!comicDetails) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-red-600">Comic Not Found</h1>
            <p className="mt-4">The comic you're looking for could not be found.</p>
            <Link href="/" className="mt-6 inline-block px-4 py-2 bg-green-600 text-white rounded-md">
              Back to Home
            </Link>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  const { comic, lowestPrice, priceHistoryData } = comicDetails;
  const defaultCoverImage = '/images/tmnt-default-cover.svg';
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="flex flex-col md:flex-row">
            {/* Comic Cover Image */}
            <div className="w-full md:w-1/3 relative">
              <div className="relative h-96 md:h-full">
                <Image 
                  src={comic.image_url || defaultCoverImage}
                  alt={`${comic.title} #${comic.issue_number} Cover`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
              </div>
            </div>
            
            {/* Comic Details */}
            <div className="w-full md:w-2/3 p-6">
              <h1 className="text-3xl font-bold text-green-800">
                {comic.title} #{comic.issue_number}
              </h1>
              
              <div className="mt-2 text-gray-600">
                <p><span className="font-semibold">Series:</span> {comic.series}</p>
                <p><span className="font-semibold">Publisher:</span> {comic.publisher}</p>
                <p><span className="font-semibold">Year:</span> {comic.year}</p>
              </div>
              
              {comic.description && (
                <div className="mt-4">
                  <h2 className="text-xl font-semibold text-green-700">Description</h2>
                  <p className="mt-2 text-gray-700">{comic.description}</p>
                </div>
              )}
              
              {lowestPrice && (
                <div className="mt-6 p-4 border border-green-200 rounded-lg bg-green-50">
                  <h2 className="text-xl font-semibold text-green-700">Current Lowest Price</h2>
                  
                  <div className="mt-2 flex justify-between items-center">
                    <div>
                      <p className="text-3xl font-bold text-green-800">${lowestPrice.current_price.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Found on: {new Date(lowestPrice.current_price_date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">Source: {lowestPrice.source}</p>
                      <p className="text-sm text-gray-600">Condition: {lowestPrice.condition || 'Not specified'}</p>
                    </div>
                    
                    {lowestPrice.url && (
                      <a 
                        href={lowestPrice.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md text-lg font-medium transition-colors duration-300"
                      >
                        Buy Now
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Price History Chart */}
        <PriceHistoryChart priceHistory={priceHistoryData} />
        
        <div className="mt-6 text-center">
          <Link href="/" className="inline-block px-4 py-2 bg-green-600 text-white rounded-md">
            Back to All Comics
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
