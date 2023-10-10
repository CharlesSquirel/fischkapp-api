import app from "./app";
import env from "../util/validateEnv";
import mongoose from "mongoose";

const port = env.PORT;
const mongoStr = env.MONGODB_CONNECTION_STRING;

mongoose
  .connect(mongoStr)
  .then(() => {
    console.log("Mongo connected");
    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch(console.error);
