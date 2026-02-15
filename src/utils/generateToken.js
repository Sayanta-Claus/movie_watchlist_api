//helper file to generate jwt token

import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  //create the token, store userid in token payload
  //sign it using our own server secret key

  const payload = { id: userId };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  //set token in httponly cookie to protect our endpoints
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", //only send cookie over https in production
    sameSite: "strict", //to prevent csrf attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days in ms, must match token expiry time
  });

  return token;
};
