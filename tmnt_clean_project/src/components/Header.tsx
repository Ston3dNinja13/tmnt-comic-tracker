import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-green-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-12 h-12 relative mr-3">
              <Image 
                src="/images/tmnt-logo.svg" 
                alt="TMNT Logo" 
                fill
                className="object-contain"
              />
            </div>
            <Link href="/" className="text-2xl font-bold hover:text-green-300 transition-colors">
              TMNT Comic Price Tracker
            </Link>
          </div>
          
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="hover:text-green-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/add-comic" className="hover:text-green-300 transition-colors">
                  Add Comic
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-green-300 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
