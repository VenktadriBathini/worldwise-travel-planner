import React from "react";
import { Link } from "react-router-dom";
import natureLandscape from "../assets/nature-landscape.jpg"; // Import background image

export default function Dashboard() {
  return (
    <div
      className="relative flex h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${natureLandscape})` }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] -z-10"></div>
      {/* Sidebar */}
      <aside className="relative z-10 w-64 bg-gray-800/80 backdrop-blur-sm text-white p-4 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <nav>
          <ul>
            <li>
              <Link
                to="/dashboard/plan-trip"
                className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors"
              >
                Plan a trip
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/upcoming-trips"
                className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors"
              >
                Upcoming trips
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/your-trips"
                className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors"
              >
                Your trips
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to your Dashboard!</h1>
        <p className="text-gray-600">
          Select an option from the sidebar to get started.
        </p>
      </main>
    </div>
  );
}
