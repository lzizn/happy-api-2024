import { Collection } from "mongodb";

import { OrphanageModel } from "@/domain/models";

import { OrphanageSeeder, MongoHelper, Seeder } from "@/infra/db";

describe("OrphanageSeeder", () => {
  const collection_name = "orphanage_seeder_test";
  let seeder: Seeder;

  let collection: Collection<OrphanageModel>;

  beforeAll(async () => {
    seeder = OrphanageSeeder(collection_name);
    collection = MongoHelper.getCollection(collection_name);
  });

  beforeEach(async () => {
    await seeder.clean();
  });

  describe("seed", () => {
    it("Should add orphanages to DB", async () => {
      // ensure orphanage collection is epty
      const orphanages = await collection.find().toArray();
      expect(orphanages).toEqual([]);

      const amount_of_seeds = 4;

      const { fromDb } = await seeder.seed(amount_of_seeds);

      const orphanagesAfterSeeding = await collection.find().toArray();

      // now it is full with seeded data
      expect(MongoHelper.mapCollection(orphanagesAfterSeeding)).toEqual(fromDb);
    });
  });

  describe("clean", () => {
    it("Should delete all orphanages from DB when no param is provided", async () => {
      // ensure collection has 10 items
      const amount_of_seeds = 10;
      await seeder.seed(amount_of_seeds);

      const amountInDb = await collection.countDocuments();

      expect(amountInDb).toBe(amount_of_seeds);

      await seeder.clean();
      const amountAfterCleaning = await collection.countDocuments();

      expect(amountAfterCleaning).toBe(0);
    });

    it("Should delete specific provided orphanages from DB", async () => {
      // ensure collection has 5 items
      const amount_of_seeds = 5;
      const { fromDb } = await seeder.seed(amount_of_seeds);

      const orphanages = await collection.find().toArray();

      expect(orphanages.length).toBe(amount_of_seeds);

      const amount_to_delete = 2;

      await seeder.clean(fromDb.slice(0, amount_to_delete));

      const amountAfterCleaning = await collection.countDocuments();

      const expectedRemaining = amount_of_seeds - amount_to_delete;

      expect(amountAfterCleaning).toBe(expectedRemaining);
    });
  });
});
