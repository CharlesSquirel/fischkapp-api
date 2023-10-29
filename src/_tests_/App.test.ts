const request = require("supertest");
import app from "../app";
const mongoose = require("mongoose");
import env from "../../util/validateEnv";
require("dotenv").config();

const auth = env.AUTHORIZATION_STRING;

import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("GET /cards", () => {
  it("fetch all cards", async () => {
    const response = await request(app).get("/cards").set("Authorization", `Bearer ${auth}`);
    expect(response.status).toBe(200);
  });
});
