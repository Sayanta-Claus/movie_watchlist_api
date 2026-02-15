import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

//read the token from request
//check if it is valid
//jwt must be sent through req headers
// key: authorzation
//value : Bearer <token>
export const authMiddleware = async (req, res, next) => {
  console.log("auth middleware reached");
  let token;
  //check both req header and cookies for the token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]; //split in 2
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return res.status(401).json({
      error: "Not authorised",
    });
  }

  try {
    //verify token and extract user id
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //decoded token will have user id
    //find user in db
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }
    //attach user to req obj
    req.user = user;
    next(); //move to next middleware or route handler
  } catch (err) {
    return res.status(401).json({
      error: "Authorization failed",
    });
  }
};
