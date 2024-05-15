/* eslint-disable @typescript-eslint/no-unsafe-argument */
import mongoose, { type ObjectId } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
const Schema = mongoose.Schema;

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: Date;
  gender: "male" | "female" | "other";
  posts: ObjectId[];
  friends: number;
}

// Creamos el schema del usuario
const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 45,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 45,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate: {
        validator: (text: string) => validator.isEmail(text),
        message: "Incorrect Email",
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minLength: [8, "The password must be at least 8 characters long"],
      select: false,
    },
    birthDate: {
      type: Date,
      require: true,
      validate: {
        validator: (value: Date) => value instanceof Date,
        message: "Incorrect format",
      }
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "personalized"],
    },
    posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: false,
      default: 0,
    }
    ],
    friends: {
      type: Number,
      default: 0,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    // If the password was already encrypted, we do not encrypt it again.
    if (this.isModified("password")) {
      const saltRounds = 10;
      const passwordEncrypted = await bcrypt.hash(this.password, saltRounds);
      this.password = passwordEncrypted;
    }

    next();
  } catch (error: any) {
    next(error);
  }
});

export const User = mongoose.model<IUser>("User", userSchema);
