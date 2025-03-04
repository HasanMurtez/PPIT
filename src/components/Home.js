import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Home = () => {
  const [user] = useAuthState(auth);

  return (
    <div className="home">
      <h1>Welcome to Car Buy Sell</h1>
      {user ? (
        <div>
          <p>You are logged in as {user.email}</p>
          <Link to="/logout">
            <button className="button">Logout</button>
          </Link>
        </div>
      ) : (
        <div>
          <p>Please log in or sign up to proceed.</p>
          <Link to="/signup">
            <button className="button">Sign Up</button>
          </Link>
          <Link to="/login">
            <button className="button">Login</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;