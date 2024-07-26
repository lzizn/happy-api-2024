import { ObjectId } from "mongodb";

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
  beforeEach(async () => {
    await cleanOrphanagesSeed();
  });

  afterEach(async () => {
    await cleanOrphanagesSeed();
  });

  describe("loadAll()", () => {
    it("Should return empty list if there are no documents", async () => {
      const sut = makeSut();
      const orphanages = await sut.loadAll();
      expect(orphanages.length).toBe(0);
    });

    it("Should load all orphanages on success", async () => {
      const { orphanagesDb } = await seedOrphanages();

      const sut = makeSut();
      const orphanages = await sut.loadAll();

      expect(orphanages.length).toBe(orphanagesDb.length);
      expect(orphanages).toEqual(orphanagesDb);
    });
  });

  describe("loadById()", () => {
    it("Should fail when providing an invalid id", async () => {
      const invalidId = "-1";

      const sut = makeSut();
      const loadPromise = sut.loadById(invalidId);

      expect(loadPromise).rejects.toThrow();
    });

    it("Should return null since when there no matches", async () => {
      const randomId = new ObjectId().toString();

      const sut = makeSut();
      const orphanage = await sut.loadById(randomId);

      expect(orphanage).toBe(null);
    });

    it("Should return matching orphanage", async () => {
      const result = await seedOrphanages();

      const sut = makeSut();

      const orphanage = await sut.loadById(
        result.orphanagesSeed[0].id as string
      );

      expect(orphanage).not.toBe(null);

      // Just for type-sake, test would fail before this anyway
      if (orphanage === null) return;

      expect(orphanage).toEqual(result.orphanagesSeed[0]);
    });
  });

  describe("create()", () => {
    it("Should create new orphanage", async () => {
      const orphanageModelMock = mockOrphanageModel();

      const sut = makeSut();
      const orphanageDb = await sut.create({ ...orphanageModelMock });

      expect(orphanageDb).toStrictEqual({
        ...orphanageModelMock,
        id: orphanageDb.id,
      });
    });
  });

  describe("update()", () => {
    it("Should update existing orphanage", async () => {
      const { orphanagesDb } = await seedOrphanages(1);

      const orphanageTarget = orphanagesDb[0];

      const sut = makeSut();

      const newOrphanageData: Partial<OrphanageModel> = {
        id: orphanageTarget.id,
        name: "new name",
        latitude: -1,
        longitude: -1,
      };

      const orphanageUpdated = await sut.update(newOrphanageData);

      expect(orphanageUpdated.id).toEqual(orphanageTarget.id);
      expect(orphanageUpdated.name).toEqual(newOrphanageData.name);
      expect(orphanageUpdated.latitude).toEqual(newOrphanageData.latitude);
      expect(orphanageUpdated.longitude).toEqual(newOrphanageData.longitude);
    });
  });
});
