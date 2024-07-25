import request from "supertest";

import { app } from "@/main/config/app";
import type { OrphanageModel } from "@/domain/models";
import { cleanOrphanagesSeed, seedOrphanages } from "@/infra/db";

describe("OrphanageResult Routes", () => {
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
      await cleanOrphanagesSeed(orphanagesSeed);
    });

    it("Should return 200 and matching orphanage", async () => {
      const orphanage = orphanagesSeed[0];
      const orphanageId = orphanage._id as string;

      const response = await request(app).get(`/api/orphanages/${orphanageId}`);

      orphanage.id = orphanage._id;
      delete orphanage._id;

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ orphanage });
    });
  });

  it("Should return 204 and empty object for body when there are no matches", async () => {
    const orphanageId = -1;
    const response = await request(app).get(`/api/orphanages/${orphanageId}`);

    expect(response.body).toEqual({});
    expect(response.statusCode).toBe(204);
  });
});
