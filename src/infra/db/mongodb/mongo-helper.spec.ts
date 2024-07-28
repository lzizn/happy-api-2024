import { Collection, MongoClient } from "mongodb";
import { getOptions, MongoHelper } from "@/infra/db";

describe("MongoHelper", () => {
  jest.setTimeout(30000);

  it("Should connect to MongoDB Client", async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);

    expect(MongoHelper.client).toBeDefined();
    expect(MongoHelper.client).toBeInstanceOf(MongoClient);
  });

  it("Should close connection to MongoDB upon calling disconnect when client is connected", async () => {
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

  it("Should have different options based on environment", () => {
    const options_test = getOptions("test");

    expect(options_test).toEqual({});

    const options_dev = getOptions("development");
    expect(options_dev).toEqual({
      serverApi: {
        deprecationErrors: true,
        strict: true,
        version: "1",
      },
    });
  });
});
