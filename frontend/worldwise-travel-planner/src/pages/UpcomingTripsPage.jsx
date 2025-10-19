import React from 'react';
import beach from "../assets/beach.jpg";

function UpcomingTripsPage() {
  return (
    <div
      className="relative flex h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${beach})` }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] -z-10"></div>
      <main className="relative z-10 flex-1 p-6">
        <h1 className="text-3xl font-bold text-white mb-4">Upcoming Trips</h1>
        <p className="text-white">Details about your upcoming trips will be displayed here.</p>
      </main>
    </div>
  );
}

export default UpcomingTripsPage;
