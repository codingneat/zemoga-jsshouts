import jwt from "jsonwebtoken";
import { User } from "../models/user.schema";

export const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: "need email and password" });
  }

  try {
    const user = await User.create(req.body);
    const token = newToken(user);
    return res.status(201).send({ token, user });
  } catch (e) {
    return res.status(500).send({ message: "Email is already used." }).end();
  }
};

export const signin = async (req, res) => {
  return res.status(201).send({ token: newToken(req.user), user: req.user });
};

export const newToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: +process.env.ACCESS_TOKEN_LIFE,
    }
  );
};
