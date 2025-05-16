import React from "react";
import { Link } from "react-router-dom";

const ErrorNotFound = () => (
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
