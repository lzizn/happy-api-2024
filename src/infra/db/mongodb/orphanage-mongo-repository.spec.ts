import {
  seedOrphanages,
  cleanOrphanagesSeed,
  OrphanageMongoRepository,
} from "@/infra/db";
import type { OrphanageModel } from "@/domain/models";

const makeSut = () => {
  return new OrphanageMongoRepository();
};

describe("OrphanageMongoRepository", () => {
  describe("loadAll()", () => {
    it("Should return empty list if there are no documents", async () => {
      const sut = makeSut();
      const orphanages = await sut.loadAll();
      expect(orphanages.length).toBe(0);
    });

    describe("Assuming orphanages in DB", () => {
      const amount_of_seeds = 2;
      let orphanagesSeed: OrphanageModel[] = [];

      // * Seed DB
      beforeAll(async () => {
        const seedResult = await seedOrphanages(amount_of_seeds);
        orphanagesSeed = seedResult.orphanagesSeed;
      });

      // * Clean DB
      afterAll(async () => {
        cleanOrphanagesSeed(orphanagesSeed);
      });

      it("Should load all orphanages on success", async () => {
        const sut = makeSut();
        const orphanages = await sut.loadAll();

        const [orphanages1, orphanages2] = orphanages;

        expect(orphanages.length).toBe(amount_of_seeds);

        expect(orphanages1.name).toBe(orphanagesSeed[0].name);
        expect(orphanages2.name).toBe(orphanagesSeed[1].name);
      });
    });
  });

  describe("loadResult()", () => {
    it("Should return null since when there no matches", async () => {
      const sut = makeSut();
      const orphanage = await sut.loadResult("-1");

      expect(orphanage).toBe(null);
    });

    it("Should return matching orphanage", async () => {
      const { orphanagesSeed } = await seedOrphanages();

      const sut = makeSut();
      const orphanageId = orphanagesSeed[0]._id as string;

      const orphanage = await sut.loadResult(orphanageId);

      expect(orphanage!.id).toBe(orphanagesSeed[0]._id);

      await cleanOrphanagesSeed(orphanagesSeed);
    });
  });
});
