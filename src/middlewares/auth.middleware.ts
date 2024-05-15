import { type NextFunction, type Response } from "express";
import { User } from "../models/User";
import { verifyToken } from "../utils/token";

// Middleware to verify user authentication
export const isAuth = async (req: any, res: Response, next: NextFunction): Promise<null> => {
  try {
    const token: string = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new Error("You are not authorized to perform this operation");
    }

    // Decode the token
    const decodedInfo = verifyToken(token);

    // Find the user in the database based on token information
    const user = await User.findOne({ email: decodedInfo.userEmail }).select("+password");

    if (!user) {
      throw new Error("You are not authorized to perform this operation");
    }

    // Save user information in the 'req' object for further use
    req.user = user;
    next();

    return null;
  } catch (error) {
    // If there's an error, send a 401 (Unauthorized) error response
    res.status(401).json(error);
    return null;
  }
};

module.exports = { isAuth };
