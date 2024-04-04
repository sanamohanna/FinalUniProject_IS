import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./login.css";
import DecorativeImage from "./decorative_image.JPG"

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = () => {
    // Check if the credentials match
    if (email === "rahaf@gmail.com" && password === "rahaf123") {
      setError(false);
      navigate("/home"); // Navigate to /home if the credentials are correct
    } else {
      setError(true); // Set error state if credentials are incorrect
    }
  };

  return (
    <div className="login">
      <img src={DecorativeImage} alt="Decorative Image" className="login-image"/>
      <h2 className="hello_message">Hello Dear Rahaf</h2>
      <h3 className="title">Login</h3>
      <input
        type="email"
        className="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="Email"
      />
      <br/>
      <input
        type="password"
        className="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        placeholder="Password"
      />
      {error ? <label className="message">Something went wrong!</label> : <label className="message">Enter your details</label>}
      <br/><br/>
      {/* Updated button to call handleLogin onClick instead of wrapping in Link */}
      <button type="button" className="submitLogin" onClick={handleLogin}>
        Login
      </button>
      <br/>
    </div>
  );
}
export default Login;
