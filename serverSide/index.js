import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userModel from "./models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;
const secret = process.env.Access_Token_Secret
const refreshSecret = process.env.Refresh_Token_Secret

mongoose.connect("mongodb://localhost:27017/authentication");

app.post("/createUser", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    
    if (user === null) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const refreshToken = jwt.sign(req.body.username, refreshSecret)
      const userData = {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        refreshtoken: refreshToken
      };
      userModel
        .create(userData)
        .then((users) => res.json({
          status: 200,
        }))
        .catch((err) => res.json(err));
    } else {
      res.json({
        status: 400
      })
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
        status: 400
      })
    }
    
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (isMatch) {
      const accessToken = generateAccessToken(user)
      res.json({
        status: 200,
        accessToken: accessToken,
      });
    } else {
      res.send("Not Allowed");
    }
  } catch (error) {
    res.status(500).send();
    console.log(error);
  }
});

app.post('/user/data', authenticateToken, async (req, res) => {
  try {
    console.log('Authenticated user:', req.user); // Check if user is set correctly
    const user = await userModel.findOne({ username: req.user.username }); // Assuming req.user contains a username field
    if (!user) {
      return res.status(404).send("User not found");
    }
    
    return res.json({ username: user.username });
  } catch (error) {
    console.error('Server error:', error); // Log the server error
    res.status(500).send("Server error");
  }
});


app.post('/token', async (req, res) => {
  try {
    const user = await userModel.findOne({ username: req.body.username });
    if (user === null) {
      return res.status(400).json({ status: 400 });
    }

    const refreshToken = user.refreshtoken;
    jwt.verify(refreshToken, refreshSecret, (err, decodedUser) => {
      if (err) {
        console.error('Token verification error:', err);
        return res.sendStatus(403); // Forbidden if token verification fails
      }

      // Generate new access token
      const accessToken = generateAccessToken({ username: user.username });
      res.json({ accessToken });
    });
  } catch (error) {
    console.error('Error:', error);
    res.sendStatus(500); // Internal Server Error
  }
});


app.post('/user/logout', async (req, res) => {
  try {
    if (!req.body || !req.body.username) {
      return res.status(400).send("Invalid user data");
    }

    const user = await userModel.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Sign a new refresh token
    const refreshToken = jwt.sign({ username: req.body.username }, refreshSecret);

    // Update the user's refresh token in the database
    let myquery = { refreshtoken: user.refreshtoken };
    let newvalues = { $set: { refreshtoken: refreshToken } };

    const result = await userModel.updateOne(myquery, newvalues);

    if (result.nModified === 0) {
      return res.status(400).send("Failed to update the refresh token");
    }

    console.log(`oldrefresh:${user.refreshtoken}, newrefresh:${refreshToken}`);

    return res.status(200).json({ status: 200, message: "Logout success" });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send("Server error");
  }
});





function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      console.error('Token verification error:', err); // Log the token verification error
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

function generateAccessToken(user) {
  return jwt.sign({ username: user.username }, secret, { expiresIn: '30s' });
}






app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});

