/* eslint-disable @typescript-eslint/no-unsafe-argument */
import express, { type NextFunction, type Response, type Request } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token";

// models
import { User } from "../models/User";

// users router
export const userRouter = express.Router();

userRouter.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract email and password from the request body
    const email = req.body.email;
    const emailExists = await User.findOne({ email });
    const password = req.body.password;

    // Check if email or password is missing
    if (!email || !password) {
      // If either email or password is missing, send a 404 response with an error message
      res.status(404).json({ error: "Please provide an email and a password." });
    } else if (emailExists) {
      res.status(404).json({ error: "There is an account with this email already. Please, try with another one." });
    } else {
      // Create a new user instance using the data from the request body
      const user = new User(req.body);
      // If both email and password are provided, save the user to the database
      const createdUser = await user.save();
      // Send a 201 response with the created user object
      return res.status(201).json(createdUser);
    }
  } catch (error) {
    // If an error occurs during the process, pass it to the next middleware
    next(error);
  }
});

userRouter.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Destructuring email and password from request body
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
      // If either email or password is missing, send a 404 response with an error message
      res.status(404).json({ error: "In order to login, please provide your email and password" });
    }

    // Finding user by email in the database and selecting the password field
    const user: any = await User.findOne({ email }).select("+password");

    // If user is not found, send a 401 response with an error message
    if (!user) {
      res.status(401).json({ error: "Oops, there is no user registered with the information you provided. Please, try again or create an account, it's free." });
    }

    // Verifying if the provided password matches the stored password
    const match: any = await bcrypt.compare(password, user.password);

    if (match) {
      // If password matches, remove the password from the user object
      const userWithoutPass: any = user.toObject();
      delete userWithoutPass.password;

      // Generate JWT token
      const jwtToken = generateToken(user._id.toString(), user.email);

      // Send a 200 response with the JWT token
      return res.status(200).json({ token: jwtToken, user });
    } else {
      // If password does not match, send a 401 response with an error message
      return res.status(401).json({ error: "Email and/or password incorrect" });
    }
  } catch (error) {
    // If an error occurs during the process, pass it to the next middleware
    next(error);
  }
});
