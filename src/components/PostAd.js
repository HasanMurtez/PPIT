import React, { useState } from 'react';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const PostAd = () => {
  //use the useauthstate hook to get the current loggedin user from firebase
  const [user] = useAuthState(auth);
  
  //state to manage the ad form fields
  const [ad, setAd] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    description: '',
    image: '',
    location: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

   //handle changes in form fields
  const handleChange = (e) => {
    setAd({ ...ad, [e.target.name]: e.target.value }); //update the field 
  };

   //handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        setError('You must be logged in to post an ad');
        return;
      }
        //make a post request to the backend to save the ad
      await axios.post('http://localhost:4000/api/ads', {

        ...ad, //spread the ad data to send all ad details
        postedBy: user.uid // add the user id of the user posting the ad
      });
      
      alert('Car ad posted successfully!');
      navigate('/');
      setAd({
        make: '',
        model: '',
        year: '',
        price: '',
        mileage: '',
        description: '',
        image: '',
        location: '',
      }); //reset the form after successful submission

    } catch (error) {
      setError('Failed to post ad. Please try again.');
      console.error('Posting error:', error);
    }
  };

  return (
    <div className="postad">
      <div className="form">
        <h2>Post a Car Ad</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="make"
            placeholder="Make (e.g. Toyota)"
            value={ad.make}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="model"
            placeholder="Model (e.g. Camry)"
            value={ad.model}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="year"
            placeholder="Year (e.g. 2020)"
            value={ad.year}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price in € (e.g. 15000)"
            value={ad.price}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="mileage"
            placeholder="Mileage"
            value={ad.mileage}
            onChange={handleChange}
          />
          <input
            type="text"
            name="location"
            placeholder="Location (e.g. Dublin)"
            value={ad.location}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={ad.description}
            onChange={handleChange}
          />
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={ad.image}
            onChange={handleChange}
          />
          <button type="submit">Post Ad</button>
        </form>
      </div>
    </div>
  );
};

export default PostAd;