import React, { useState } from 'react';

interface AddComicFormProps {
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

export default function AddComicForm({ onAddComic, isLoading = false }: AddComicFormProps) {
  const [title, setTitle] = useState('');
  const [issueNumber, setIssueNumber] = useState('');
  const [series, setSeries] = useState('');
  const [publisher, setPublisher] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!title || !issueNumber || !series || !publisher || !year) {
      setError('Please fill in all required fields');
      return;
    }

    const issueNum = parseInt(issueNumber);
    const yearNum = parseInt(year);

    if (isNaN(issueNum) || issueNum <= 0) {
      setError('Issue number must be a positive number');
      return;
    }

    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear()) {
      setError('Please enter a valid year');
      return;
    }

    try {
      await onAddComic({
        title,
        issue_number: issueNum,
        series,
        publisher,
        year: yearNum,
        description: description || undefined,
        image_url: imageUrl || undefined,
      });

      // Reset form after successful submission
      setTitle('');
      setIssueNumber('');
      setSeries('');
      setPublisher('');
      setYear('');
      setDescription('');
      setImageUrl('');
    } catch (err) {
      setError('Failed to add comic. Please try again.');
      console.error('Error adding comic:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-green-800 mb-4">Add New Comic to Track</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Comic title"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="issueNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Issue Number *
            </label>
            <input
              type="number"
              id="issueNumber"
              value={issueNumber}
              onChange={(e) => setIssueNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="1"
              min="1"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="series" className="block text-sm font-medium text-gray-700 mb-1">
              Series *
            </label>
            <input
              type="text"
              id="series"
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Series name"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-1">
              Publisher *
            </label>
            <input
              type="text"
              id="publisher"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Publisher name"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Year *
            </label>
            <input
              type="number"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="1984"
              min="1900"
              max={new Date().getFullYear()}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="https://example.com/comic-cover.jpg"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={3}
            placeholder="Brief description of the comic"
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              isLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            } transition-colors duration-300`}
          >
            {isLoading ? 'Adding...' : 'Add Comic'}
          </button>
        </div>
      </form>
    </div>
  );
}
