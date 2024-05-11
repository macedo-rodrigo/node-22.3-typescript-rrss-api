import express, { type NextFunction, type Response, type Request } from "express";
// import bcrypt from bcrypt;

// models
import { User } from "../models/User";

// users router
export const userRouter = express.Router();

// CRUD: READ
// EJEMPLO DE REQ: http://localhost:3000/user?page=1&limit=10
userRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = new User(req.body);
    const createdUser = await user.save();
    return res.status(201).json(createdUser);
  } catch (error) {
    next(error);
  }
});
