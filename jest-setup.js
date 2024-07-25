/* eslint-disable */
const { MongoHelper } = require("./src/infra/db/mongodb/mongo-helper");

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL);
});

afterAll(async () => {
  await MongoHelper.disconnect();
});
