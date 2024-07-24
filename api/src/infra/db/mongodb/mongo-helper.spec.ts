import { Collection, MongoClient } from "mongodb";
import { MongoHelper } from "./mongo-helper";

describe("MongoHelper", () => {
  jest.setTimeout(30000);

  afterEach(async () => {
    await MongoHelper.disconnect();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it("Should connect to MongoDB Client", async () => {
    expect(MongoHelper.client).toBe(null);

    await MongoHelper.connect(process.env.MONGO_URL as string);

    expect(MongoHelper.client).toBeDefined();
    expect(MongoHelper.client).toBeInstanceOf(MongoClient);
  });

  it("Should close connection to MongoDB upon calling disconnect when client is connected", async () => {
    expect(MongoHelper.client).toBe(null);

    await MongoHelper.connect(process.env.MONGO_URL as string);

    expect(MongoHelper.client).toBeDefined();
    expect(MongoHelper.client).toBeInstanceOf(MongoClient);

    await MongoHelper.disconnect();

    expect(MongoHelper.client).toBe(null);
  });

  it("Should do nothing when closing connection and Client is not connected", async () => {
    expect(MongoHelper.client).toBe(null);

    await MongoHelper.disconnect();

    expect(MongoHelper.client).toBe(null);
  });

  it("Should return collection if there is connection", async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);

    const collection = MongoHelper.getCollection("users");

    expect(collection).toBeInstanceOf(Collection);
  });
});
