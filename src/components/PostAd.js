import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PostAd = () => {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    description: "",
    image: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.make || !formData.model || !formData.year || !formData.price) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/api/ads", formData);
      if (response.status === 201) {
        navigate("/"); //redirects back to home page after posting an ad
      }
    } catch (error) {
      setError("Failed to post ad. Please try again.");
    }
  };

  return (
    <div>
       <h2>Post a Car Ad</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="make"
          placeholder="Make (e.g. Ford)"
          value={formData.make}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="model"
          placeholder="Model (e.g. Focus)"
          value={formData.model}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="year"
          placeholder="Year (e.g., 2020)"
          value={formData.year}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price (e.g., 15,000)"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="mileage"
          placeholder="Mileage (e.g., 100,000)"
          value={formData.mileage}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
        />
        <button type="submit">Post Ad</button>
      </form>
    </div>
  );
};

export default PostAd;