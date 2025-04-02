import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';

const ViewAds = () => {
  const [ads, setAds] = useState([]);
  const [error, setError] = useState('');
  const [user] = useAuthState(auth);

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
    <div className="view-ads">
      <h2>Available Car Ads</h2>
      {error && <p className="error">{error}</p>}
      <div className="ads-list">
        {ads.length > 0 ? (
          ads.map((ad) => (
            <div key={ad._id} className="ad-item">
              <h3>{ad.make} {ad.model}</h3>
              <p><strong>Year:</strong> {ad.year}</p>
              <p><strong>Price:</strong> €{ad.price}</p>
              <p><strong>Mileage:</strong> {ad.mileage} km</p>
              <p>{ad.description}</p>
              {ad.image && <img src={ad.image} alt={`${ad.make} ${ad.model}`} style={{ width: '250px', height: 'auto', objectFit: 'cover' }} />}
              <Link to={`/ad-details/${ad._id}`} className="view-details-link">
                View Details
              </Link>
              {user && ad.postedBy === user.uid && (
                <button onClick={() => handleDelete(ad._id)} className="delete-button">
                  Delete Ad
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No ads available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default ViewAds;
