const request = require("supertest");
const app = require("./app");
const mongoose = require("mongoose");

import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
