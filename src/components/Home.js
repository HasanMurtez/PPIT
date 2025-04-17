import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaLock, FaSearch, FaMobileAlt, FaTags } from "react-icons/fa";

const Home = () => {
  const [user] = useAuthState(auth);

  return (
    <div className="home">
      <h1>Welcome to AutoBazaar</h1>
      <p>Buy. Sell. Drive. All in one place.</p>

      {user ? (
        <div>
          <p>You are logged in as <strong>{user.email}</strong></p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/view-ads"><button className="button">Browse Cars</button></Link>
            <Link to="/post-ad"><button className="button">Sell Your Car</button></Link>
            <Link to="/logout"><button className="button">Logout</button></Link>
          </div>
        </div>
      ) : (
        <div>
          <p>Please log in or sign up to explore the marketplace.</p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup"><button className="button">Sign Up</button></Link>
            <Link to="/login"><button className="button">Login</button></Link>
          </div>
        </div>
      )}

      <div style={{ marginTop: "60px", maxWidth: "800px", width: "100%" }}>
        <h2 style={{ color: "#1a73e8", fontWeight: "bold", marginBottom: "20px" }}>Why Choose AutoBazaar?</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
          <div className="feature-card">
            <FaLock size={30} color="#ff6f61" />
            <h3>Secure Messaging</h3>
            <p>Chat safely within the platform.</p>
          </div>
          <div className="feature-card">
            <FaSearch size={30} color="#ff6f61" />
            <h3>Verified Listings</h3>
            <p>All posts are reviewed for quality.</p>
          </div>
          <div className="feature-card">
            <FaTags size={30} color="#ff6f61" />
            <h3>No Hidden Fees</h3>
            <p>Transparent and honest pricing.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
