import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>About AutoBazaar</h1>
        <p className="tagline">Connecting car buyers and sellers since 2025</p>
      </div>

      <div className="about-section">
        <h2>Our Mission</h2>
        <p>
          At AutoBazaar, we're passionate about making car buying and selling simple, transparent, and enjoyable. 
          Our platform connects car enthusiasts, first-time buyers, and sellers in a secure and user-friendly 
          environment where finding your perfect vehicle or the right buyer is just a few clicks away.
        </p>
      </div>

      <div className="about-section about-features">
        <h2>What Makes Us Different</h2>
        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon">🔒</div>
            <h3>Secure Messaging</h3>
            <p>Our built-in messaging system ensures your communications remain private and secure.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔍</div>
            <h3>Verified Listings</h3>
            <p>We review all listings to ensure quality and accuracy for a trustworthy experience.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">💰</div>
            <h3>No Hidden Fees</h3>
            <p>Transparent pricing with no surprises when buying or selling.</p>
          </div>
        </div>
      </div>

      <div className="about-section about-story">
        <h2>Our Story</h2>
        <p>
          AutoBazaar began as a solution to the frustration of buying and selling cars through traditional 
          classified ads and dealerships. Founded by a team of automotive enthusiasts and tech specialists, 
          we set out to create a platform that puts users first.
        </p>
        <p>
          Since our launch, we've helped thousands of users find their dream cars and sellers connect with 
          the right buyers. We're constantly improving our platform based on user feedback and market trends 
          to deliver the best car marketplace experience possible.
        </p>
      </div>

      <div className="about-section about-Founder">
      <h2>Meet Our CEO</h2>
      <div className="ceo-grid">
      <div className="ceo-member">
      <div className="ceo-photo">
        <img
          src="/Hasan_Murtaza.jpg" 
          alt="Hasan Murtaza"
          className="ceo-image"
        />
      </div>
      <h3>Hasan Murtaza</h3>
      <p>Founder & CEO</p>
          </div>
        </div>
      </div>

      <div className="about-section about-connect">
        <h2>Connect With Us</h2>
        <p>
          Follow us on social media for the latest updates, car buying tips, and automotive news.
        </p>
        <div className="social-links">
          <div className="social-link"><FaInstagram /> Instagram</div>
          <div className="social-link"><FaFacebook /> Facebook</div>
          <div className="social-link"><FaTwitter /> Twitter</div>
          <div className="social-link"><FaLinkedin /> LinkedIn</div>
        </div>
      </div>

      <div className="about-section about-cta">
        <h2>Ready to Get Started?</h2>
        <p>
          Join thousands of satisfied users who have found their perfect car match on AutoBazaar.
        </p>
        <div className="cta-buttons">
          <Link to="/view-ads" className="cta-button browse">Browse Cars</Link>
          <Link to="/post-ad" className="cta-button sell">Sell Your Car</Link>
        </div>
      </div>
    </div>
  );
};

export default About;
