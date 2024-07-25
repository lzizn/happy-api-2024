import { Collection, ObjectId } from "mongodb";

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
      const orphanagesAddModels = mockOrphanageModels(orphanages_amount).map(
        (x) => ({
          ...x,
          _id: new ObjectId(),
        })
      );
      const result = await orphanageCollection.insertMany(orphanagesAddModels);

      expect(result.insertedCount).toBe(orphanages_amount);

      const sut = makeSut();
      const orphanages = await sut.loadAll();

      const [orphanages1, orphanages2] = orphanages;

      expect(orphanages.length).toBe(orphanages_amount);

      expect(orphanages1.id).toBe(orphanagesAddModels[0]._id.toString());
      expect(orphanages1.name).toBe(orphanagesAddModels[0].name);

      expect(orphanages2.id).toBe(orphanagesAddModels[1]._id.toString());
      expect(orphanages2.name).toBe(orphanagesAddModels[1].name);
    });
  });

  describe("loadResult()", () => {
    it("Should return null since when there no matches", async () => {
      const sut = makeSut();
      const orphanage = await sut.loadResult("-1");

      expect(orphanage).toBe(null);
    });

    it("Should return matching orphanage", async () => {
      const orphanages = mockOrphanageModels(5);
      const orphanagesWithId = orphanages.map((x) => ({
        ...x,
        _id: new ObjectId(),
      }));

      await orphanageCollection.insertMany(orphanagesWithId);

      const sut = makeSut();
      const orphanageId = orphanagesWithId[0]._id;

      const orphanage = await sut.loadResult(orphanageId);

      expect(orphanage!.id).toBe(orphanagesWithId[0]._id.toString());
    });
  });
});
