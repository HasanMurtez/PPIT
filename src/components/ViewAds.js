import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ViewAds = () => {
  const [ads, setAds] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:4000/api/ads')
      .then((response) => {
        setAds(response.data.ads);
      })
      .catch((error) => {
        setError('Failed to load car ads.');
        console.error(error);
      });
  }, []);

  return (
    <div className="view-ads-container">
      <h2>{ads.length} {ads.length === 1 ? 'Car' : 'Cars'} Available</h2>
      
      {error && <p className="error-message">{error}</p>}

      <div className="ads-grid">
        {ads.length > 0 ? (
          ads.map((ad) => (
            <div key={ad._id} className="ad-card">
              <div className="ad-image-container">
                <img 
                  src={ad.image || '/default-car.jpg'} 
                  alt={`${ad.make} ${ad.model}`} 
                  className="ad-image"
                />
              </div>

              <div className="ad-content">
                <h3 className="ad-title">{ad.make} {ad.model}</h3>
                <div className="ad-specs">
                  <p><strong>Year:</strong> {ad.year}</p>
                  <p><strong>Mileage:</strong> {ad.mileage ? `${ad.mileage.toLocaleString()} km` : 'N/A'}</p>
                  <p><strong>Location:</strong> {ad.location || 'Not specified'}</p>
                </div>
                
                <div className="ad-price">
                  €{ad.price.toLocaleString()}
                </div>

                <Link to={`/ad/${ad._id}`} className="details-button">
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="no-ads">No ads available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default ViewAds;