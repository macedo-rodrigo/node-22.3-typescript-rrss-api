import jwt from "jsonwebtoken"; // Importing the JSON Web Token (JWT) library

import dotenv from "dotenv"; // Importing dotenv for environment variables
dotenv.config(); // Loading environment variables from a .env file if present

// Function to generate a JWT token
export const generateToken = (id: string, email: string): string => {
  // Check if email or userId is missing
  if (!email || !id) {
    throw new Error("Email or userId missing");
  }

  // Creating a payload containing userId and userEmail
  const payload = {
    userId: id,
    userEmail: email,
  };

  // Generating a JWT token with a expiration of 1 day
  const token = jwt.sign(payload, process.env.JWT_SECRET ?? "default_secret", { expiresIn: "1d" });

  // Returning the generated token
  return token;
};

// Function to verify a JWT token
export const verifyToken = (token: string): any => {
  // Check if the token is missing
  if (!token) {
    throw new Error("Token is missing");
  }

  // Verifying the token using the JWT_SECRET from environment variables
  const result = jwt.verify(token, process.env.JWT_SECRET ?? "default_secret"); // preguntar a Sergio sobre esto!

  // Returning the decoded token
  return result;
};
