import { Collection } from "mongodb";

import { mockOrphanageModels } from "@/domain/mocks";
import { MongoHelper, OrphanageMongoRepository } from "@/infra/db";

let orphanageCollection: Collection;

const makeSut = () => {
  return new OrphanageMongoRepository();
};

describe("OrphanageMongoRepository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  beforeEach(async () => {
    orphanageCollection = MongoHelper.getCollection("orphanage");
    await orphanageCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe("loadAll()", () => {
    it("Should load empty list", async () => {
      const sut = makeSut();
      const orphanages = await sut.loadAll();
      expect(orphanages.length).toBe(0);
    });

    it("Should load all orphanages on success", async () => {
      const orphanages_amount = 2;

      // * Seed DB
      const orphanagesAddModels = mockOrphanageModels(orphanages_amount);
      const result = await orphanageCollection.insertMany(orphanagesAddModels);

      expect(result.insertedCount).toBe(orphanages_amount);

      const sut = makeSut();
      const orphanages = await sut.loadAll();

      expect(orphanages.length).toBe(orphanages_amount);

      expect(orphanages[0].id).toBe(result.insertedIds["0"].toString());
      expect(orphanages[0].name).toBe(orphanagesAddModels[0].name);

      expect(orphanages[1].id).toBe(result.insertedIds["1"].toString());
      expect(orphanages[1].name).toBe(orphanagesAddModels[1].name);
    });
  });
});
