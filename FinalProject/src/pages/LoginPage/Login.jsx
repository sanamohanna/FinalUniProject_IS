import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import DecorativeImage from "./decorative_image.JPG";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const RESPONSE_STATUS = {
    FAIL: false,
    SUCCESS: true,
  };
  const submit = async () => {
    try {
      if (email.length == 0 || password.length == 0) {
        setError(true);
      } else {
        const body = { email, password };
        const result = await fetch("http://localhost:3002/login", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const bodyPar = await result.json();
        console.log(bodyPar, "bodyPar");

        if (bodyPar?.status === RESPONSE_STATUS.SUCCESS) {
          console.log("good user and pass");
          window.location.href = "/";
        } else {
          alert("there is something wrong !");
          setError(true);
          //bodyPar.message;
        }
      }
    } catch (err) {
      console.error(err.message);
      alert("there is something wrong !");
    }
  };
  return (
    <div className="login">
      <img
        src={DecorativeImage}
        alt="Decorative Image"
        className="login-image"
      />
      <h3 className="title">Login</h3>
      <input
        type="email"
        className="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        name="email"
        placeholder="Email"
      />
      <br></br>
      <input
        type="password"
        className="password"
        onChange={(e) => setPassword(e.target.value)}
        name="password"
        value={password}
        placeholder="Password"
      />

      <br></br>
      <br></br>
      <button type="button" onClick={submit} className="submitLogin">
        Login
      </button>
      <br></br>
      <Link to="/Signup">
        <button className="link-btn">New user? Create account here.</button>
      </Link>
    </div>
  );
}
export default Login;
