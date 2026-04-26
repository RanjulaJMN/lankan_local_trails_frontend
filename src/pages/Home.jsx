import { Link } from "react-router-dom";
import { MapPin, Clock, Calendar, Users, ArrowRight, Compass, Mountain, Camera } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: MapPin,
      title: "Discover Places",
      description: "Explore tourist attractions within 25km radius"
    },
    {
      icon: Clock,
      title: "Opening Hours",
      description: "Find accurate opening times and travel tips"
    },
    {
      icon: Calendar,
      title: "Plan Your Day",
      description: "Create personalized one-day visit plans"
    },
    {
      icon: Users,
      title: "Local Insights",
      description: "Authentic travel tips from locals"
    }
  ];

  const categories = [
    { name: "Historical", icon: Compass, color: "bg-amber-500" },
    { name: "Nature", icon: Mountain, color: "bg-green-500" },
    { name: "Cultural", icon: Camera, color: "bg-purple-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Lankan Local Trails
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover hidden gems and plan your perfect one-day adventure within 25km of your location
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/places"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
              >
                Explore Places
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all border border-gray-200"
              >
                Join as Traveler
                <Users className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Lankan Local Trails?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We help you discover authentic local experiences with reliable information
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore by Category</h2>
            <p className="text-gray-600">Find places that match your interests</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/places?category=${category.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className={`h-48 ${category.color} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <category.icon className="w-12 h-12 text-white mx-auto mb-2" />
                    <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-lg mb-6 opacity-90">Start planning your one-day adventure today</p>
          <Link
            to="/places"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all"
          >
            Explore Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}