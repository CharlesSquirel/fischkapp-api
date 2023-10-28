const request = require("supertest");
const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();
import env from "../../util/validateEnv";

const port = env.PORT;
const mongoStr = env.MONGODB_CONNECTION_STRING;

beforeEach(async () => {
  await mongoose.connect(mongoStr);
});

afterEach(async () => {
  await mongoose.connection.close();
});
