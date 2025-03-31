import React, { useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const PostAd = () => {
  const [user] = useAuthState(auth);
  const [ad, setAd] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    description: '',
    image: '',
    postedBy: user?.uid || ''
  });

  const handleChange = (e) => {
    setAd({ ...ad, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        alert('You must be logged in to post an ad');
        return;
      }
      
      const adData = { ...ad,
        postedBy: user.uid
      };
      
      const response = await axios.post('http://localhost:4000/api/ads', adData);
      console.log(response.data);
      alert('Car ad posted successfully!');
      setAd({
        make: '',
        model: '',
        year: '',
        price: '',
        mileage: '',
        description: '',
        image: '',
        postedBy: user.uid
      });
    } catch (error) {
      console.error('Error posting ad:', error);
      alert('Failed to post ad. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
      <h1>Post a Car Ad</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formMake">
          <Form.Label>Make</Form.Label>
          <Form.Control
            type="text"
            name="make"
            value={ad.make}
            onChange={handleChange}
            placeholder="Enter car make (e.g. Toyota)"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formModel">
          <Form.Label>Model</Form.Label>
          <Form.Control
            type="text"
            name="model"
            value={ad.model}
            onChange={handleChange}
            placeholder="Enter car model (e.g. Camry)"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formYear">
          <Form.Label>Year</Form.Label>
          <Form.Control
            type="number"
            name="year"
            value={ad.year}
            onChange={handleChange}
            placeholder="Enter manufacturing year"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPrice">
          <Form.Label>Price ($)</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={ad.price}
            onChange={handleChange}
            placeholder="Enter price"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formMileage">
          <Form.Label>Mileage</Form.Label>
          <Form.Control
            type="number"
            name="mileage"
            value={ad.mileage}
            onChange={handleChange}
            placeholder="Enter mileage (optional)"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={ad.description}
            onChange={handleChange}
            placeholder="Enter description (optional)"
            rows={3}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formImage">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            name="image"
            value={ad.image}
            onChange={handleChange}
            placeholder="Enter image URL (optional)"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Post Ad
        </Button>
      </Form>
    </div>
  );
};

export default PostAd;