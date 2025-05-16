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

          {/* Right Column - Illustration or Additional Info */}
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
      </div>
    </div>
  </div>
);

export default ErrorNotFound;
