/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
// import { userRouter } from "./routes/user.routes";

import { type Request, type Response, type NextFunction, type ErrorRequestHandler } from "express";

import express from "express";
import cors from "cors";
import { connect } from "./db";

const main = async (): Promise<void> => {
  // Database connection
  const database = await connect();

  // Server configuration
  const PORT = 3000;
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );

  // Routes
  const router = express.Router();
  router.get("/", (req: Request, res: Response) => {
    res.send(`This is our API's ROOT. We are using the database ${database?.connection?.name as string}`);
  });
  router.get("*", (req: Request, res: Response) => {
    res.status(404).send("Sorry :( We couldn't find the requested page.");
  });

  // Application middlewares, e.g., console logging middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const date = new Date();
    console.log(`Request of type ${req.method} to url ${req.originalUrl} on ${date.toString()}`);
    next();
  });

  // Using the routes
  // app.use("/user", userRouter);
  app.use("/public", express.static("public"));
  app.use("/", router);

  // Error handling middleware
  app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    console.log("*** ERROR START ***");
    console.log(`FAILED REQUEST: ${req.method} to url ${req.originalUrl}`);
    console.log(err);
    console.log("*** ERROR END ***");

    // Trick to remove the type from a variable
    const errorAsAny: any = err as unknown as any;

    if (err?.name === "ValidationError") {
      res.status(400).json(err);
    } else if (errorAsAny.errmsg?.indexOf("duplicate key") !== -1) {
      res.status(400).json({ error: errorAsAny.errmsg });
    } else {
      res.status(500).json(err);
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

void main();
