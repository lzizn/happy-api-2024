import request from "supertest";
import { Collection } from "mongodb";

import { app } from "@/main/config/app";
import { MongoHelper } from "@/infra/db";
import { mockOrphanageModels } from "@/domain/mocks";
import type { OrphanageModel } from "@/domain/models";

describe("Orphanages Routes", () => {
  let orphanageCollection: Collection<OrphanageModel>;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
    orphanageCollection =
      MongoHelper.getCollection<OrphanageModel>("orphanage");
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe("Seeded Orphanages", () => {
    beforeAll(async () => {
      // * Seed DB
      const amount_of_seeds = 2;
      const orphanagesAddModels = mockOrphanageModels(amount_of_seeds);
      await orphanageCollection.insertMany(orphanagesAddModels);
    });

    afterAll(async () => {
      await orphanageCollection.deleteMany({});
    });

    it("Should return 200 and list all orphanages", async () => {
      const orphanages = await orphanageCollection.find().toArray();

      const response = await request(app).get("/api/orphanages");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        orphanages: MongoHelper.mapCollection(orphanages),
      });
    });
  });

  it("Should return 204 and empty object for body if there are no orphanages in DB", async () => {
    const response = await request(app).get("/api/orphanages");

    expect(response.statusCode).toBe(204);
    expect(response.body).toEqual({});
  });
});
