import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app";
import env from "../../util/validateEnv";
const request = require("supertest");
const mongoose = require("mongoose");
const _ = require("lodash");
require("dotenv").config();
import CardModel from "../models/model";

const auth = env.AUTHORIZATION_STRING;

const mockedPOST1 = {
  front: "test1",
  back: "test1",
  tags: ["test1", "test tag"],
  author: "test author",
};

const mockedPOST2 = {
  front: "test2",
  back: "test2",
  tags: ["test2", "test tag"],
  author: "test author",
};

const mockedPOST3 = {
  front: "test3",
  back: "test3",
  tags: ["test3", "test tag"],
  author: "test author",
};

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

  it("GET /cards/author/:author && /cards/tags/:tag", async () => {
    const response1 = await request(app).post("/cards").set("Authorization", `Bearer ${auth}`).send(mockedPOST1);
    expect(response1.status).toBe(201);

    const response2 = await request(app).post("/cards").set("Authorization", `Bearer ${auth}`).send(mockedPOST2);
    expect(response2.status).toBe(201);

    const response3 = await request(app).post("/cards").set("Authorization", `Bearer ${auth}`).send(mockedPOST3);
    expect(response3.status).toBe(201);

    const responseGetAllCards = await request(app).get("/cards").set("Authorization", `Bearer ${auth}`);
    expect(responseGetAllCards.status).toBe(200);
    expect(responseGetAllCards.body.length).toBe(3);

    const author = "test author";

    const responseGetByAuthor = await request(app).get(`/cards/author/${author}`).set("Authorization", `Bearer ${auth}`)
    const cardsByAuthor = responseGetByAuthor.body;
    expect(responseGetByAuthor.status).toBe(200)
    expect(cardsByAuthor.length).toBe(3)
    for (const card of cardsByAuthor) {
      expect(card).toHaveProperty("author", author)
    }
    const isDescending = _.isEqual(responseGetByAuthor.body, _.orderBy(responseGetByAuthor.body, [], ["desc"]));
    expect(isDescending).toBe(true);

    const tag = "test tag"

    const responseGetByTag = await request(app).get(`/cards/tags/${tag}`).set("Authorization", `Bearer ${auth}`)
    const cardsByTag = responseGetByTag.body;
    expect(responseGetByTag.status).toBe(200);
    expect(cardsByTag.length).toBe(3)
  });
});


