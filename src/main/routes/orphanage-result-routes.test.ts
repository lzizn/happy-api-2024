import request from "supertest";
import { Collection } from "mongodb";

import { app } from "@/main/config/app";
import { MongoHelper } from "@/infra/db";
import { mockOrphanageModels } from "@/domain/mocks";
import type { OrphanageModel } from "@/domain/models";

describe("OrphanageResult Routes", () => {
  let orphanageCollection: Collection<OrphanageModel>;
  const amount_of_seeds = 2;
  const orphanagesAddModels = mockOrphanageModels(amount_of_seeds);

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
      await orphanageCollection.insertMany(orphanagesAddModels);
    });

    afterAll(async () => {
      await orphanageCollection.deleteMany({});
    });

    it("Should return 200 and orphanage", async () => {
      const orphanage = orphanagesAddModels[0];
      const orphanageId = orphanage._id as string;

      const response = await request(app).get(
        `/api/orphanages/${orphanageId}/results`
      );

      orphanage.id = orphanage._id;
      delete orphanage._id;

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ orphanage });
    });
  });

  it("Should return 204 and empty object for body when there are no matches", async () => {
    const orphanageId = -1;
    const response = await request(app).get(
      `/api/orphanages/${orphanageId}/results`
    );

    expect(response.body).toEqual({});
    expect(response.statusCode).toBe(204);
  });
});
