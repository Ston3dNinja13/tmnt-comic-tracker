import React, { useState } from 'react';
import { Comic, LowestPrice } from '@/lib/database';
import ComicCard from './ComicCard';
import ComicSearch from './ComicSearch';
import AddComicForm from './AddComicForm';

interface ComicListProps {
  comics: (Comic & { lowestPrice: LowestPrice })[];
  onAddComic: (comic: {
    title: string;
    issue_number: number;
    series: string;
    publisher: string;
    year: number;
    description?: string;
    image_url?: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export default function ComicList({ comics, onAddComic, isLoading = false }: ComicListProps) {
  const [filteredComics, setFilteredComics] = useState(comics);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSearch = (results: Comic[]) => {
    // We need to map the results back to our combined type with lowestPrice
    const matchedComics = comics.filter(comic => 
      results.some(result => result.id === comic.id)
    );
    setFilteredComics(matchedComics);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-800">Comic Price Tracker</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-300"
        >
          {showAddForm ? 'Hide Form' : 'Add New Comic'}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6">
          <AddComicForm onAddComic={onAddComic} isLoading={isLoading} />
        </div>
      )}

      <ComicSearch comics={comics} onSearch={handleSearch} />

      {filteredComics.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No comics found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredComics.map(comic => (
            <ComicCard
              key={comic.id}
              id={comic.id}
              title={comic.title}
              issueNumber={comic.issue_number}
              series={comic.series}
              lowestPrice={comic.lowestPrice}
              imageUrl={comic.image_url}
            />
          ))}
        </div>
      )}
    </div>
  );
}
