// src/pages/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Lankan Local Trails
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover the beauty of Sri Lanka's hidden gems
          </p>
          
          <div className="flex justify-center gap-4">
            <Link
              to="/admin/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Admin Portal
            </Link>
            <Link
              to="/login"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              User Portal
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-4">🏞️</div>
            <h3 className="text-xl font-semibold mb-2">Beautiful Places</h3>
            <p className="text-gray-600">Explore amazing locations across Sri Lanka</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">Plan Your Visit</h3>
            <p className="text-gray-600">Create personalized travel itineraries</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <p className="text-gray-600">Share experiences with fellow travelers</p>
          </div>
        </div>
      </div>
    </div>
  );
}