import { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import Navbar from "../Naavbar/Navbar";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:3001/user/data")
      .then((result) => {
        setUserData(result.data);
      })
      .catch((err) => {
        console.error(err);
        setError("An error occurred while fetching user data.");
      });
  }, []);
  

  const handleLogout = async () => {
    try {
      await axios
        .post("http://localhost:3001/user/logout", {
          username: userData?.username,
        })
        .then((result) => {
          if (result.data.status === 200) {
            navigate("/");
          }
        });

      // Clear tokens on client side by removing the cookies
      // This can be handled on the server side during logout
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="container">
      <Navbar user={userData} onLogout={handleLogout} />
      <div className="message-box">
        {userData ? (
          <h1>Welcome home {userData.username}</h1>
        ) : (
          <h1>{error || "Loading..."}</h1>
        )}
      </div>
    </div>
  );
};

export default Home;
