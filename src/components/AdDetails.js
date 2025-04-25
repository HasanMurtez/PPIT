import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { FaMapMarkerAlt, FaArrowLeft , FaEnvelope } from 'react-icons/fa';
import MessageModal from './MessageModal';

const AdDetails = () => {
  const { id } = useParams(); // access the ad id from the URL
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false); //modal state for sending messages

  useEffect(() => {
    const fetchAd = async () => {
      try {
          // mae an api request to fetch ad details
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

//function to handle ad deletion  
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

   // function to handle opening message modal
  const handleMessageClick = () => {

    // if the user is not logged in navigate them to the login page
    if (!user) {
      if (window.confirm('You need to be logged in to send messages. Go to login page?')) {
        navigate('/login', { state: { returnUrl: `/ad/${id}` } });
      }
      return;
    }
    
    // dont allow messaging your own ad
    if (user.uid === ad.postedBy) {
      alert("You can't message your own ad");
      return;
    }
    
    setIsMessageModalOpen(true); // open message modal
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
              <button 
                className="message-button"
                onClick={handleMessageClick}
              >
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
            </div>
          )}
        </div>
      </div>

      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        adId={ad._id}
        adTitle={`${ad.make} ${ad.model}`}
        receiverId={ad.postedBy}
      />
    </div>
  );
};

export default AdDetails;