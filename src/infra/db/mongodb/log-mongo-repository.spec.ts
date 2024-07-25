import { faker } from "@faker-js/faker";
import { LogMongoRepository, MongoHelper } from "@/infra/db";

import { Collection } from "mongodb";

const makeSut = () => {
  return new LogMongoRepository();
};

let errorCollection: Collection;

describe("LogMongoRepository", () => {
  beforeEach(async () => {
    errorCollection = MongoHelper.getCollection("errors");
    await errorCollection.deleteMany({});
  });

  test("Should create an error log on success", async () => {
    const sut = makeSut();
    await sut.logError(faker.lorem.words());
    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});
