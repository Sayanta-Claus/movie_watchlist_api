//for each route we need a controller to handle the route logic

import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";
import { generateToken } from "../utils/generateToken.js";

//for each route endpoint we need a controller function

const register = async (req, res) => {
  const body = req.body;
  const { name, email, password } = body;
  // check is user already exists
  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });
  if (userExists) {
    return res.status(400).json({ error: "User already exists" });
  }

  //hash password using bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  //generate jwt token
  const token = generateToken(user.id, res);

  //success message with user data sent back
  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  //check if user exists
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!user) {
    return res.status(400).json({ error: "Invalid" });
  }
  //compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid" });
  }
  //generate jwt token
  const token = generateToken(user.id, res);

  //if password valid
  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    },
  });
};

const logout = async (req, res) => {
  //we reset the cookie on logging out
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), //expire immediately
  });
  res.status(200).json({
    status: "success",
    message: "Logged out",
  });
};

export { login, logout, register };

