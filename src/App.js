import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Logout from "./components/Logout";
import PostAd from "./components/PostAd";
import ViewAds from './components/ViewAds';
import AdDetails from "./components/AdDetails";
import Messages from './components/Messages';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import MessageNotification from "./components/MessageNotification";
import './App.css';

const Navbar = () => {
  const location = useLocation();
  const [user] = useAuthState(auth);

  return (
    <nav>
      <ul>
        <li>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Home
          </Link>
        </li>
        {!user ? (
          <>
            <li>
              <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className={location.pathname === "/signup" ? "active" : ""}>
                Sign Up
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/messages" className={location.pathname === "/messages" ? "active" : ""}>
                Messages <MessageNotification />
              </Link>
            </li>
            <li>
              <Link to="/logout" className={location.pathname === "/logout" ? "active" : ""}>
                Logout
              </Link>
            </li>
          </>
        )}
        <li>
          <Link to="/post-ad" className={location.pathname === "/post-ad" ? "active" : ""}>
            Post Ad
          </Link>
        </li>
        <li>
          <Link to="/view-ads" className={location.pathname === "/view-ads" ? "active" : ""}>
            View Ads
          </Link>
        </li>
      </ul>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/post-ad" element={<PostAd />} />
        <Route path="/view-ads" element={<ViewAds />} />
        <Route path="/ad/:id" element={<AdDetails />} />
        <Route path="/messages" element={<Messages />} />
      </Routes>
    </Router>
  );
}

export default App;