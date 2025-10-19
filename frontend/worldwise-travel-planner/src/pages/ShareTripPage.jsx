import React from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../common/Footer';
import './ShareTripPage.css'; // Assuming a CSS file for styling

const ShareTripPage = () => {
  const { tripId } = useParams();

  // In a real application, you would fetch trip details using tripId
  // and then generate a shareable link or provide sharing options.
  const shareableLink = `${window.location.origin}/shared-trip/${tripId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink)
      .then(() => alert('Shareable link copied to clipboard!'))
      .catch(err => console.error('Failed to copy: ', err));
  };

  return (
    <div className="share-trip-page">
      <main className="share-trip-content">
        <h1>Share Your Trip</h1>
        <p>Trip ID: {tripId}</p>
        <p>Here's a link you can share with your friends and family:</p>
        <div className="share-link-container">
          <input type="text" value={shareableLink} readOnly />
          <button onClick={handleCopyLink}>Copy Link</button>
        </div>
        {/* Add more sharing options here, e.g., social media buttons */}
        <div className="sharing-options">
          {/* Example: A simple button for a hypothetical "Share on Social Media" */}
          <button onClick={() => alert('Sharing to social media (not implemented)')}>Share on Social Media</button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShareTripPage;
