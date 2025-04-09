import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { FaMapMarkerAlt, FaArrowLeft, FaPhone, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/ad/${id}`);
        setAd(response.data);
      } catch (error) {
        setError('Failed to load car details. Please try again.');
        console.error('Error fetching ad:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return;
    
    try {
      await axios.delete(`http://localhost:4000/api/ad/${id}`);
      navigate('/ads');
    } catch (error) {
      setError('Failed to delete ad. Please try again.');
      console.error('Error deleting ad:', error);
    }
  };

  if (loading) {
    return (
      <div className="ad-details-container">
        <div className="loading">Loading car details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ad-details-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="ad-details-container">
        <div className="not-found">Car ad not found</div>
      </div>
    );
  }

  return (
    <div className="ad-details-container">
      <button onClick={() => navigate(-1)} className="back-button">
        <FaArrowLeft /> Back to List
      </button>

      <div className="ad-details-content">
        <div className="ad-images">
          <img 
            src={ad.image || '/default-car.jpg'} 
            alt={`${ad.make} ${ad.model}`} 
            className="main-image"
          />
        </div>

        <div className="ad-info">
          <h1>{ad.make} {ad.model}</h1>
          
          <div className="price-section">
            <span className="price">€{ad.price.toLocaleString()}</span>
          </div>

          <div className="details-section">
            <h2>Details</h2>
            <div className="details-grid">
              <div>
                <strong>Year:</strong> {ad.year}
              </div>
              <div>
                <strong>Mileage:</strong> {ad.mileage ? `${ad.mileage.toLocaleString()} km` : 'N/A'}
              </div>
              <div>
                <strong>Location:</strong> 
                <span className="location">
                  <FaMapMarkerAlt /> {ad.location}
                </span>
              </div>
            </div>
          </div>

          <div className="description-section">
            <h2>Description</h2>
            <p>{ad.description || 'No description provided.'}</p>
          </div>

          <div className="seller-section">
            <h2>Seller Information</h2>
            <div className="seller-actions">
              <button className="contact-button">
                <FaPhone /> Contact Seller
              </button>
              <button className="message-button">
                <FaEnvelope /> Send Message
              </button>
            </div>
          </div>

          {user && user.uid === ad.postedBy && (
            <div className="owner-actions">
              <button 
                onClick={handleDelete}
                className="delete-button"
              >
                Delete This Ad
              </button>
              <Link to={`/edit-ad/${ad._id}`} className="edit-button">
                Edit This Ad
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdDetails;