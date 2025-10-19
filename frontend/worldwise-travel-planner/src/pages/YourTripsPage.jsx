import React from 'react';
import luca from "../assets/luca.jpg";

function YourTripsPage() {
  return (
    <div
      className="relative flex h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${luca})` }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] -z-10"></div>
      <main className="relative z-10 flex-1 p-6">
        <h1 className="text-3xl font-bold text-white mb-4">Your Trips</h1>
        <p className="text-white">Details about all your planned trips will be displayed here.</p>
      </main>
    </div>
  );
}

export default YourTripsPage;
