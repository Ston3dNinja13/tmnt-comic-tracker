import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-green-800 text-white py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              &copy; {currentYear} TMNT Comic Price Tracker. All rights reserved.
            </p>
            <p className="text-xs mt-1">
              Teenage Mutant Ninja Turtles and all related characters are property of their respective owners.
            </p>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="text-white hover:text-green-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-white hover:text-green-300 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-white hover:text-green-300 transition-colors">
              Contact
            </a>
          </div>
        </div>
        
        <div className="mt-4 text-center text-xs">
          <p>
            This website tracks comic book prices from various marketplaces and is updated daily.
            Prices shown are the lowest available at the time of checking.
          </p>
        </div>
      </div>
    </footer>
  );
}
