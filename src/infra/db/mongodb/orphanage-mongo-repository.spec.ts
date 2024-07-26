import {
  seedOrphanages,
  cleanOrphanagesSeed,
  OrphanageMongoRepository,
} from "@/infra/db";
import { mockOrphanageModel } from "@/domain/mocks";
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

  describe("loadById()", () => {
    it("Should return null since when there no matches", async () => {
      const sut = makeSut();
      const orphanage = await sut.loadById("-1");

      expect(orphanage).toBe(null);
    });

    it("Should return matching orphanage", async () => {
      const { orphanagesSeed } = await seedOrphanages();

      const sut = makeSut();
      const orphanageId = orphanagesSeed[0]._id as string;

      const orphanage = await sut.loadById(orphanageId);

      expect(orphanage!.id).toBe(orphanagesSeed[0]._id);

      await cleanOrphanagesSeed(orphanagesSeed);
    });
  });

  describe("save()", () => {
    it("Should create new orphanage if it does not exist", async () => {
      const orphanageModelMock = mockOrphanageModel();

      const sut = makeSut();
      const orphanageDb = await sut.save(orphanageModelMock);

      expect(orphanageDb).not.toBe(null);

      // just for type-sake.. if its null it would fail anyway
      if (!orphanageDb) return;

      expect(orphanageDb.name).toEqual(orphanageModelMock.name);
      expect(orphanageDb.latitude).toEqual(orphanageModelMock.latitude);
      expect(orphanageDb.longitude).toEqual(orphanageModelMock.longitude);
      expect(orphanageDb.description).toEqual(orphanageModelMock.description);
      expect(orphanageDb.instructions).toEqual(orphanageModelMock.instructions);
    });

    it("Should update orphanage if it exists", async () => {
      const { orphanagesSeed } = await seedOrphanages(1);

      const sut = makeSut();

      const newOrphanageData = {
        id: orphanagesSeed[0]._id,
        name: "new name",
        description: "new description",
        latitude: -1,
        longitude: -1,
      };

      const newOrphanageDb = await sut.save(newOrphanageData);

      expect(newOrphanageDb).not.toBe(null);

      // just for type-sake.. if its null it would fail anyway
      if (!newOrphanageDb) return;

      expect(newOrphanageDb.name).toEqual(newOrphanageData.name);
      expect(newOrphanageDb.description).toEqual(newOrphanageData.description);
      expect(newOrphanageDb.latitude).toEqual(newOrphanageData.latitude);
      expect(newOrphanageDb.longitude).toEqual(newOrphanageData.longitude);
    });
  });
});
