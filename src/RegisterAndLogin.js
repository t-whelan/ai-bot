import React, { useState } from "react";
import { database } from "./FirebaseConfig";
import "./register.css";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

function RegisterAndLogin() {
  const [isSignIn, setIsSignIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    // Validate email format
    if (!isValidEmail(email)) {
      setErrorMessage("Invalid email format. Please enter a valid email.");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    try {
      if (isSignIn) {
        const userCredential = await signInWithEmailAndPassword(
          database,
          email,
          password
        );
        const user = userCredential.user;
        console.log("SignIn success:", user);
        navigate("/home");
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          database,
          email,
          password
        );
        const user = userCredential.user;
        console.log("SignUp success:", user);
        navigate("/home");
      }
    } catch (error) {
      // Display appropriate error message
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("User already exists. Please sign in.");
      } else {
        setErrorMessage("Authentication failed. Please check your credentials.");
        console.error("Authentication error:", error.code, error.message);
      }
    }
  };

//   const handleReset = () => {
//     navigate("/forgotpassword");
//   };

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="form-container">
      <div className="form-content">
        <div className="row">
          <div
            className={isSignIn ? "pointer" : "activeColor"}
            onClick={() => {
              setIsSignIn(false);
              setErrorMessage(""); // Clear any previous error messages
            }}
          >
            Sign Up
          </div>
          <div
            className={isSignIn ? "activeColor" : "pointer"}
            onClick={() => {
              setIsSignIn(true);
              setErrorMessage(""); // Clear any previous error messages
            }}
          >
            Sign In
          </div>
        </div>
        <h1 className="signup">{isSignIn ? "Sign In" : "Sign Up"}</h1>
        <form onSubmit={handleSubmit}>
          <input className="inputs" name="email" placeholder="Email" required />
          <br />
          <input
            className="inputs"
            name="password"
            type="password"
            placeholder="Password"
            required
          />
          <br />
          {/* <p className="resetpass" onClick={handleReset}>
            Forgot Password?
          </p> */}
          <br />
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <button className="signupbtn" type="submit">
            {isSignIn ? "Sign In" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterAndLogin;