import Link from 'next/link';
import Image from 'next/image';
import { LowestPrice } from '@/lib/database';

interface ComicCardProps {
  id: number;
  title: string;
  issueNumber: number;
  series: string;
  lowestPrice: LowestPrice;
  imageUrl?: string;
}

export default function ComicCard({ id, title, issueNumber, series, lowestPrice, imageUrl }: ComicCardProps) {
  // Format dates for display
  const currentPriceDate = new Date(lowestPrice.current_price_date).toLocaleDateString();
  const previousPriceDate = lowestPrice.previous_price_date 
    ? new Date(lowestPrice.previous_price_date).toLocaleDateString() 
    : 'N/A';

  // Calculate price change percentage
  const priceChange = lowestPrice.previous_price 
    ? ((lowestPrice.current_price - lowestPrice.previous_price) / lowestPrice.previous_price) * 100 
    : 0;
  
  // Determine if price went up, down, or stayed the same
  const priceDirection = lowestPrice.previous_price 
    ? (lowestPrice.current_price > lowestPrice.previous_price 
      ? 'up' 
      : (lowestPrice.current_price < lowestPrice.previous_price ? 'down' : 'same'))
    : 'same';

  // Default TMNT cover image if none provided
  const defaultCoverImage = '/images/tmnt-default-cover.svg';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Comic Cover Image - Make it clickable to go to the source */}
        <div className="w-full md:w-1/3 relative">
          {lowestPrice.url ? (
            <a href={lowestPrice.url} target="_blank" rel="noopener noreferrer">
              <div className="relative h-64 md:h-full">
                <Image 
                  src={imageUrl || defaultCoverImage}
                  alt={`${title} #${issueNumber} Cover`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 bg-green-600 text-white text-center py-2 opacity-90">
                  Click to Buy
                </div>
              </div>
            </a>
          ) : (
            <Link href={`/comics/${id}`}>
              <div className="relative h-64 md:h-full">
                <Image 
                  src={imageUrl || defaultCoverImage}
                  alt={`${title} #${issueNumber} Cover`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
              </div>
            </Link>
          )}
        </div>
        
        {/* Comic Details and Pricing */}
        <div className="w-full md:w-2/3 p-4">
          <h3 className="text-lg font-bold text-green-800">
            <Link href={`/comics/${id}`} className="hover:underline">
              {title} #{issueNumber}
            </Link>
          </h3>
          <p className="text-sm text-gray-600">{series}</p>
          
          <div className="mt-3 flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold">Current Price:</p>
              <p className="text-lg font-bold">${lowestPrice.current_price.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Found on: {currentPriceDate}</p>
            </div>
            
            <div>
              <p className="text-sm font-semibold">Previous Price:</p>
              <p className="text-lg font-bold">
                {lowestPrice.previous_price 
                  ? `$${lowestPrice.previous_price.toFixed(2)}` 
                  : 'N/A'}
              </p>
              <p className="text-xs text-gray-500">Found on: {previousPriceDate}</p>
            </div>
            
            {lowestPrice.previous_price && (
              <div className={`
                px-2 py-1 rounded text-white text-sm font-bold
                ${priceDirection === 'up' ? 'bg-red-500' : 
                  priceDirection === 'down' ? 'bg-green-500' : 'bg-gray-500'}
              `}>
                {priceDirection === 'up' ? '↑' : 
                 priceDirection === 'down' ? '↓' : '→'} 
                {Math.abs(priceChange).toFixed(1)}%
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div>
              <p className="text-sm">Source: {lowestPrice.source}</p>
              <p className="text-sm">Condition: {lowestPrice.condition || 'Not specified'}</p>
            </div>
            
            {lowestPrice.url && (
              <a 
                href={lowestPrice.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300"
              >
                Buy Now
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
