import { ObjectId } from "mongodb";

import { mockOrphanageModel } from "@/domain/mocks";
import type { OrphanageModel } from "@/domain/models";

import { OrphanageSeeder, Seeder, OrphanageMongoRepository } from "@/infra/db";

const makeSut = () => {
  return new OrphanageMongoRepository();
};

describe("OrphanageMongoRepository", () => {
  let seeder: Seeder;

  beforeAll(() => {
    seeder = OrphanageSeeder();
  });

  beforeEach(async () => {
    await seeder.clean();
  });

  afterEach(async () => {
    await seeder.clean();
  });

  describe("loadAll()", () => {
    it("Should return empty list if there are no documents", async () => {
      const sut = makeSut();
      const orphanages = await sut.loadAll();
      expect(orphanages.length).toBe(0);
    });

    it("Should load all orphanages on success", async () => {
      const { fromDb } = await seeder.seed();

      const sut = makeSut();
      const orphanages = await sut.loadAll();

      expect(orphanages.length).toBe(fromDb.length);
      expect(orphanages).toEqual(fromDb);
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
      const { fromDb } = await seeder.seed();

      const sut = makeSut();

      const orphanage = await sut.loadById(fromDb[0].id as string);

      expect(orphanage).not.toBe(null);

      // Just for type-sake, test would fail before this anyway
      if (orphanage === null) return;

      expect(orphanage).toEqual(fromDb[0]);
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
      const { fromDb } = await seeder.seed(1);

      const orphanageTarget = fromDb[0];

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
