import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app";
import env from "../../util/validateEnv";
const request = require("supertest");
const mongoose = require("mongoose");
const _ = require("lodash");
require("dotenv").config();
import CardModel from "../models/model";

const auth = env.AUTHORIZATION_STRING;

const mockedPOST = [
  {
    front: "test1",
    back: "test1",
    tags: ["test1"],
    author: "test author",
  },
  {
    front: "test2",
    back: "test2",
    tags: ["test2"],
    author: "test author",
  },
  { front: "test3", back: "test3", tags: ["test3"], author: "test author" },
];

const getCountFromMongoDB = async () => {
  const count = await CardModel.countDocuments();
  return count;
};

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

describe("Test finding cards", () => {
  it("GET /cards", async () => {
    const response = await request(app).get("/cards").set("Authorization", `Bearer ${auth}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    const isDescending = _.isEqual(response.body, _.orderBy(response.body, [], ["desc"]));
    expect(isDescending).toBe(true);
    const expectedCount = await getCountFromMongoDB();
    expect(response.body.length).toBe(expectedCount);
  });

  it("GET /cards/author/:author", async () => {
    await CardModel.create(mockedPOST);
    const response = await request(app).get("/cards/author").set("Authorization", `Bearer ${auth}`);
  });
});
