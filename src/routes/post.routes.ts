import express, { type NextFunction, type Response, type Request } from "express";

// import { Post } from "../models/Post";

export const postRouter = express.Router();

postRouter.post("/", (req: Request, res: Response, next: NextFunction) => {
  console.log("WIP");
});
