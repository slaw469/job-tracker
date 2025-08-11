import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-3xl font-bold mb-2">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-4">The page you’re looking for doesn’t exist.</p>
        <Link to="/" className="px-4 py-2 bg-black text-white">Go Home</Link>
      </div>
    </div>
  );
}

