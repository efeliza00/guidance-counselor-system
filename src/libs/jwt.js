import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export const signIn = async (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    console.log(err);
    return null;
  }
};
