import { Express, Request, Response } from "express";

require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://CharlesSquirel:${process.env.APP_MONGOPASSWORD}@fishkappapi.koexjkr.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

const express = require("express");
const app: Express = express();

const PORT = process.env.PORT || 4000;

app.get("/", (req: Request, res: Response) => {
  res.send(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
