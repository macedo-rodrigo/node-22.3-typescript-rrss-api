/* eslint-disable @typescript-eslint/no-unsafe-argument */
import express, { type NextFunction, type Response, type Request } from "express";
import { User } from "../models/User";
import { Post } from "../models/Post";

export const postRouter = express.Router();

postRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const { owner }: any = req.body;
  const user = await User.findOne({ firstName: owner });
  try {
    if (user) {
      const newPost = await Post.create({ ...req.body, owner: user._id });

      // Agregar la nueva publicación al campo de publicaciones del usuario
      user.posts.push(newPost._id as any);
      await user.save();
      res.status(200).json({ newPost });
    } else {
      res.status(404).json({ error: "this user doesn't exist" });
    }
  } catch (error) {
    next(error);
  }
});
