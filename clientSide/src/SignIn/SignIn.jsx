import "./SignIn.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const Submit = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:3001/createuser", { username, email, password })
      .then((result) => {
        if (result.data.status === 200) {
          alert("Profile created successfully");
          navigate("/Login");
        } else {
          alert("User with this email already exists, please use a different mail.");
          navigate("/Signin");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={Submit} id="form" name="form">
        <p className="form-title">Create an account</p>
        <div className="input-container">
          <input
            type="text"
            placeholder="Username"
            id="username"
            name="username"
            onChange={(event) => setName(event.target.value)}
          />
          <span></span>
        </div>
        <div className="input-container">
          <input
            type="email"
            placeholder="Email"
            id="email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
          />
          <span></span>
        </div>
        <div className="input-container">
          <input
            type="password"
            placeholder="Enter password"
            id="password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit" className="submit">
          Sign in
        </button>

        <p className="signup-link">
          <a href="/Login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
