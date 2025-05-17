import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getCloudflareContext } from '@/lib/cloudflare';
import { getRepositories } from '@/lib/database';
import { updateAllComicPrices } from '@/lib/scheduled-update';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function manualUpdate() {
  'use server';
  
  try {
    const result = await updateAllComicPrices();
    return result;
  } catch (error) {
    console.error('Error updating prices:', error);
    return { success: false, error: 'Failed to update prices' };
  }
}

export default function AdminPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-green-800 mb-6">Admin Dashboard</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-bold text-green-700 mb-3">Manual Price Update</h2>
            <p className="mb-4">
              Use this button to manually trigger a price update for all comics. This will check all marketplaces
              for the latest prices and update the database accordingly.
            </p>
            <form action={manualUpdate}>
              <button 
                type="submit"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-300"
              >
                Update All Prices Now
              </button>
            </form>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-bold text-green-700 mb-3">Scheduled Updates</h2>
            <p className="mb-4">
              The system is configured to automatically update prices daily at 2:00 AM UTC.
              This ensures that all price data is kept current without manual intervention.
            </p>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="font-mono text-sm">Cron schedule: <span className="font-bold">0 2 * * *</span></p>
              <p className="text-sm text-gray-600 mt-1">This is configured in the wrangler.toml file.</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-bold text-green-700 mb-3">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/" className="block p-4 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-300">
                <h3 className="font-bold">Home Page</h3>
                <p className="text-sm text-gray-600">View all tracked comics</p>
              </Link>
              <Link href="/add-comic" className="block p-4 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-300">
                <h3 className="font-bold">Add Comic</h3>
                <p className="text-sm text-gray-600">Add a new comic to track</p>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
