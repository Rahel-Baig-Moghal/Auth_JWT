import { Link } from "react-router-dom";
import "./Login.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setAccessToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const Submit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3001/users/login", { username, password })
      .then((result) => {
        if (result.data.status === 200) {
          setAccessToken(result.data.accessToken);
          navigate("/Home");
        } else if (result.data.status === 400){
          alert("Please enter correct username")
          navigate("/Login")
        }
         else {
          navigate("/Accessdenied");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={Submit} id="form" name="form">
        <p className="form-title">Login</p>
        <div className="input-container">
          <input
            type="text"
            placeholder="Username"
            id="username"
            name="username"
            onChange={(event) => setUsername(event.target.value)}
          />
          <span></span>
        </div>
        <div className="input-container">
          <input
            type="password"
            placeholder="Password"
            id="password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button type="submit" className="submit">
          Login
        </button>

        <p className="signup-link">
          <a href="">
            <Link to="/Signin">Sign Up</Link>
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
