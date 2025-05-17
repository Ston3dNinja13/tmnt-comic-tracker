import React, { useState } from 'react';
import { Comic } from '@/lib/database';

interface ComicSearchProps {
  comics: Comic[];
  onSearch: (results: Comic[]) => void;
}

export default function ComicSearch({ comics, onSearch }: ComicSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState<'title' | 'series' | 'publisher'>('title');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      // If search is empty, return all comics
      onSearch(comics);
      return;
    }
    
    const term = searchTerm.toLowerCase().trim();
    
    // Filter comics based on search term and selected field
    const results = comics.filter(comic => {
      switch (searchBy) {
        case 'title':
          return comic.title.toLowerCase().includes(term);
        case 'series':
          return comic.series.toLowerCase().includes(term);
        case 'publisher':
          return comic.publisher.toLowerCase().includes(term);
        default:
          return false;
      }
    });
    
    onSearch(results);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
        <div className="flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search comics..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <div className="flex-shrink-0">
          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value as 'title' | 'series' | 'publisher')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="title">Title</option>
            <option value="series">Series</option>
            <option value="publisher">Publisher</option>
          </select>
        </div>
        
        <div className="flex-shrink-0">
          <button
            type="submit"
            className="w-full md:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-300"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
