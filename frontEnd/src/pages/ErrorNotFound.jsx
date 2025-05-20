import React from "react";
import { Link } from "react-router-dom";

const ErrorNotFound = () => (

  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto">
      {/* Logo and Company Name */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-sky-700">
          GUTS <span className="text-red-600 text-2xl">Investigation</span>
        </h2>
      </div>

      {/* Error Content */}
      <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Error Code and Primary Message */}
          <div className="text-center md:text-left">
            <h1 className="text-8xl font-bold text-red-600 mb-4">404</h1>
            <p className="text-3xl font-semibold text-gray-800 mb-4">
              Oops! Page Not Found
            </p>
            <p className="text-lg text-gray-600 mb-8">
              The page you are looking for might have been removed, renamed, or is temporarily unavailable.
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center px-6 py-3 bg-sky-700 hover:bg-sky-800 
                       text-white font-medium rounded-lg transition-colors duration-200"
            >
              Return Home
            </Link>
          </div>

          {/* Right Column - Help Section */}
          <div className="hidden md:block">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Need Help?
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Check the URL for typos</li>
                <li>• Return to the homepage</li>
                <li>• Contact support if the issue persists</li>
              </ul>
            </div>
          </div>
        </div>
=======
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div className="grid grid-cols-2 gap-4 text-center">
      <div>
        <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
        <p className="text-2xl text-gray-700 mb-6">Page Not Found</p>
        <p className="text-lg text-gray-600">
          The page you are looking for does not exist.
        </p>
      </div>
      <div>
        <h2 className="text-4xl font-bold text-sky-700 mb-6">GUTS <span className="text-red-600 text-2xl">Investigation </span></h2>
        <p className="text-lg text-gray-600 mb-4">
          We are sorry, but the page you are looking for does not exist. It might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="px-4 py-2 bg-sky-700 text-white rounded">
          Go Home
        </Link>

      </div>
    </div>
  </div>
);

export default ErrorNotFound;
