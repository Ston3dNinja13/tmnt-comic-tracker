import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-green-800 mb-6">About TMNT Comic Price Tracker</h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <p className="mb-4">
                The TMNT Comic Price Tracker is a specialized tool designed for fans and collectors of Teenage Mutant Ninja Turtles comics. 
                Our website tracks the lowest prices of TMNT Series 1 comic books (issues 1-66, 1984-1993) across various online marketplaces.
              </p>
              
              <h2 className="text-xl font-bold text-green-700 mt-6 mb-3">Features</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Daily price updates for all tracked comics</li>
                <li>Historical price tracking showing both current and previous lowest prices</li>
                <li>Direct links to purchase comics at the lowest price found</li>
                <li>Comic cover images for easy identification</li>
                <li>Ability to add more comics to track beyond the initial TMNT Series 1</li>
                <li>Search functionality to quickly find specific comics</li>
              </ul>
              
              <h2 className="text-xl font-bold text-green-700 mt-6 mb-3">How It Works</h2>
              <p className="mb-4">
                Our system automatically scans multiple comic book marketplaces daily to find the lowest prices for each comic.
                When a lower price is found, we update our database and keep the previous price for comparison.
                This allows collectors to track price trends and make informed purchasing decisions.
              </p>
              
              <h2 className="text-xl font-bold text-green-700 mt-6 mb-3">Add Your Own Comics</h2>
              <p className="mb-4">
                While we focus on TMNT Series 1 comics, you can add any comic book to track by using our "Add Comic" feature.
                Simply provide the details of the comic you want to track, and our system will start monitoring prices for it.
              </p>
              
              <div className="mt-6">
                <Link href="/add-comic" className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-300">
                  Add a Comic to Track
                </Link>
              </div>
            </div>
            
            <div className="md:w-1/3">
              <div className="relative h-96 w-full">
                <Image 
                  src="/images/tmnt-logo.svg"
                  alt="TMNT Logo"
                  fill
                  className="object-contain"
                />
              </div>
              
              <div className="bg-green-100 border border-green-300 rounded-lg p-4 mt-6">
                <h3 className="font-bold text-green-800 mb-2">Did You Know?</h3>
                <p className="text-sm">
                  The first issue of Teenage Mutant Ninja Turtles was published in May 1984 by Mirage Studios in a limited print run of only 3,000 copies.
                  Today, a near-mint copy of TMNT #1 (first printing) can sell for tens of thousands of dollars!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
