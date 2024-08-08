import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./SignIn/SignIn";
import Login from "./Login/Login";
import Home from "./Home/Home";
import AccessDenied from "./AccessDenied/AccessDenied";
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  function newAccessToken() {
    axios
      .post("http://localhost:3001/token", { token: refreshToken })
      .then((result) => {
        if (result) {
          setAccessToken(result.data.accessToken);
        }
      })
      .catch((err) => console.log(err));
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Login setAccessToken={setAccessToken} />}
          ></Route>
          <Route path="/Signin" element={<SignIn />}></Route>
          <Route
            path="/Login"
            element={<Login setAccessToken={setAccessToken} />}
          ></Route>
          <Route
            path="/Home"
            element={<Home accessToken={accessToken}  setRefreshToken={setRefreshToken} />}
          ></Route>
          <Route path="/Accessdenied" element={<AccessDenied />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
