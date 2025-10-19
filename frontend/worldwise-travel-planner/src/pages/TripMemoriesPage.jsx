import React from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../common/Footer';
import './TripMemoriesPage.css'; // Assuming a CSS file for styling

const TripMemoriesPage = () => {
  const { tripId } = useParams();

  return (
    <div className="trip-memories-page">
      <main className="trip-memories-content">
        <h1>Memories for Trip ID: {tripId}</h1>
        <p>This page will allow you to upload photos, videos, and notes from your trip.</p>
        {/* Placeholder for memory input and display */}
        <div className="memory-upload-section">
          <h2>Add a New Memory</h2>
          <input type="file" accept="image/*,video/*" />
          <textarea placeholder="Write a note about this memory..."></textarea>
          <button>Save Memory</button>
        </div>
        <div className="memory-list">
          <h2>Your Trip Memories</h2>
          <p>No memories added yet. Start by adding one above!</p>
          {/* Placeholder for displaying memories */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TripMemoriesPage;
