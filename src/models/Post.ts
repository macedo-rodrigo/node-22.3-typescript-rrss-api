/* eslint-disable @typescript-eslint/consistent-type-imports */
import mongoose, { ObjectId } from "mongoose";
const Schema = mongoose.Schema;

// as we are using typescript, we need to create an interface for each model we will use
export interface IPost {
  content: string;
  owner: ObjectId;
}

const postSchema = new Schema<IPost>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model<IPost>("Post", postSchema);
