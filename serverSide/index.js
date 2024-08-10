import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userModel from "./models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

const PORT = 3001;
const secret = process.env.Access_Token_Secret;
const refreshSecret = process.env.Refresh_Token_Secret;

mongoose.connect("mongodb://localhost:27017/authentication");

app.post("/createUser", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (user === null) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const refreshToken = jwt.sign(req.body.username, refreshSecret);
      const userData = {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        refreshtoken: refreshToken,
      };
      userModel
        .create(userData)
        .then(() =>
          res.json({
            status: 200,
          })
        )
        .catch((err) => res.json(err));
    } else {
      res.json({
        status: 400,
      });
    }
  } catch (error) {
    res.status(500).send();
    console.log(error);
  }
});

app.post("/users/login", async (req, res) => {
  try {
    const user = await userModel.findOne({ username: req.body.username });
    if (user === null) {
      return res.json({
        status: 400,
      });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (isMatch) {
      const accessToken = generateAccessToken(user);
      res.cookie("accesstoken", accessToken, { maxAge: 60000 });
      res.cookie("username", user.username);
      res.json({
        status: 200,
        message: 'Login successful'
      });
    } else {
      res.send("Not Allowed");
    }
  } catch (error) {
    res.status(500).send();
    console.log(error);
  }
});

app.get("/user/data", authenticateToken, async (req, res) => {
  try {
    const user = await userModel.findOne({ username: req.cookies.username });
    if (!user) {
      return res.status(404).send("User not found");
    }

    return res.json({ username: user.username });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
});

app.post("/user/logout", async (req, res) => {
  try {
    if (!req.body || !req.body.username) {
      return res.status(400).send("Invalid user data");
    }

    const user = await userModel.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const refreshToken = jwt.sign(
      { username: req.body.username },
      refreshSecret
    );

    let myquery = { refreshtoken: user.refreshtoken };
    let newvalues = { $set: { refreshtoken: refreshToken } };

    const result = await userModel.updateOne(myquery, newvalues);

    if (result.nModified === 0) {
      return res.status(400).send("Failed to update the refresh token");
    }

    console.log(`oldrefresh:${user.refreshtoken}, newrefresh:${refreshToken}`);

    return res.status(200).json({ status: 200, message: "Logout success" });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
});

async function authenticateToken(req, res, next) {
  let accesstoken = req.cookies.accesstoken;

  if (!accesstoken) {
    accesstoken = await renewAccessToken(req, res);
    if (!accesstoken) return;
  }

  jwt.verify(accesstoken, secret, async (err, user) => {
    if (err) {
      console.error("Token verification error:", err);
      accesstoken = await renewAccessToken(req, res);
      if (!accesstoken) return res.sendStatus(403);

      jwt.verify(accesstoken, secret, (err, user) => {
        if (err) {
          console.error("Re-verification error after renewal:", err);
          return res.sendStatus(403);
        }
        req.user = user;
        next();
      });
    } else {
      req.user = user;
      next();
    }
  });
}

async function renewAccessToken(req, res) {
  try {
    const username = req.cookies.username;

    if (!username) {
      res.status(400).json({ status: 400, message: "Username not found in cookies" });
      return null;
    }

    const user = await userModel.findOne({ username });
    if (!user) {
      res.status(400).json({ status: 400, message: "User not found" });
      return null;
    }

    const refreshToken = user.refreshtoken;
    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, refreshSecret, (err) => {
        if (err) {
          console.error("Refresh token verification error:", err);
          res.sendStatus(403);
          return resolve(null);
        }

        const accessToken = generateAccessToken({ username: user.username });
        res.cookie('accesstoken', accessToken, { httpOnly: true });
        resolve(accessToken);
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.sendStatus(500);
    return null;
  }
}

function generateAccessToken(user) {
  return jwt.sign({ username: user.username }, secret, { expiresIn: "60s" });
}

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});


