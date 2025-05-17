import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AddComicForm from '@/components/AddComicForm';
import { getCloudflareContext } from '@/lib/cloudflare';
import { getRepositories } from '@/lib/database';
import { findLowestPrice } from '@/lib/price-tracker';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function addComic(formData: {
  title: string;
  issue_number: number;
  series: string;
  publisher: string;
  year: number;
  description?: string;
  image_url?: string;
}) {
  'use server';
  
  const { env } = getCloudflareContext();
  const repositories = getRepositories(env.DB);
  
  try {
    // Add comic to database
    const comicId = await repositories.comics.addComic(formData);
    
    // Find initial lowest price
    const lowestPrice = await findLowestPrice(formData.title, formData.issue_number);
    
    // Save lowest price to database
    await repositories.lowestPrices.updateLowestPrice({
      comic_id: comicId,
      ...lowestPrice
    });
    
    // Redirect to the comic detail page
    redirect(`/comics/${comicId}`);
  } catch (error) {
    console.error('Error adding comic:', error);
    return { success: false, error: 'Failed to add comic' };
  }
}

export default function AddComicPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Add New Comic to Track</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="mb-6 text-gray-700">
            Use the form below to add a new comic book to track. Our system will automatically search for the lowest price
            across various marketplaces and update it daily.
          </p>
          
          <AddComicForm 
            onAddComic={addComic}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
