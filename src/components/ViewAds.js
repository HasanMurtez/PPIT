import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ViewAds = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/ads');
        setAds(response.data.ads);
      } catch (error) {
        setError('Failed to load car ads. Please try again later.');
        console.error('Error fetching ads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  if (loading) {
    return (
      <div className="view-ads-container">
        <div className="loading">Loading available cars...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-ads-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="view-ads-container">
      <div className="ads-header">
        <h2>{ads.length} {ads.length === 1 ? 'Car' : 'Cars'} Available</h2>
      </div>

      <div className="ads-grid">
        {ads.length > 0 ? (
          ads.map((ad) => (
            <div key={ad._id} className="ad-card">
              <div className="ad-image-container">
                <img
                  src={ad.image || '/default-car.jpg'}
                  alt={`${ad.make} ${ad.model}`}
                  className="ad-image"
                  onError={(e) => {
                    e.target.src = '/default-car.jpg';
                  }}
                />
              </div>

              <div className="ad-content">
                <h3 className="ad-title">{ad.make} {ad.model}</h3>
                
                <div className="ad-specs">
                  <p><strong>Year:</strong> {ad.year}</p>
                  <p><strong>Mileage:</strong> {ad.mileage ? `${ad.mileage.toLocaleString()} km` : 'N/A'}</p>
                </div>

                <div className="ad-location">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>{ad.location || 'Location not specified'}</span>
                </div>

                <div className="ad-price">€{ad.price.toLocaleString()}</div>

                <Link to={`/ad/${ad._id}`} className="details-button">
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="no-ads">
            <p>No cars available at the moment.</p>
            <Link to="/post-ad" className="details-button">
              Post an Ad
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAds;