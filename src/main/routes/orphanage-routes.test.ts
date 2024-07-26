import request from "supertest";

import { app } from "@/main/config/app";
import { cleanOrphanagesSeed, MongoHelper, seedOrphanages } from "@/infra/db";

describe("Orphanages Routes", () => {
  describe("/orphanages", () => {
    it("Should return 200 and list all orphanages", async () => {
      await cleanOrphanagesSeed();

      // * Seed DB
      const { orphanagesSeed } = await seedOrphanages();

      const response = await request(app).get("/api/orphanages");

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        "orphanages",
        MongoHelper.mapCollection(orphanagesSeed)
      );

      // * Clean up DB
      await cleanOrphanagesSeed(orphanagesSeed);
    });

    it("Should return 204 and empty object for body if there are no orphanages in DB", async () => {
      await cleanOrphanagesSeed();

      const response = await request(app).get("/api/orphanages");

      expect(response.body).toEqual({});
      expect(response.statusCode).toBe(204);
    });
  });

  describe("/orphanages/:orphanageId", () => {
    describe("Assuming orphanages in DB", () => {
      it("Should return 200 and matching orphanage", async () => {
        await cleanOrphanagesSeed();

        const { orphanagesSeed } = await seedOrphanages(2);

        const orphanageTarget = orphanagesSeed[0];

        const response = await request(app).get(
          `/api/orphanages/${orphanageTarget._id as string}`
        );

        orphanageTarget.id = orphanageTarget._id;
        delete orphanageTarget._id;

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ orphanage: orphanageTarget });

        await cleanOrphanagesSeed(orphanagesSeed);
      });
    });

    it("Should return 204 and empty object for body when there are no matches", async () => {
      const orphanageId = -1;
      const response = await request(app).get(`/api/orphanages/${orphanageId}`);

      expect(response.body).toEqual({});
      expect(response.statusCode).toBe(204);
    });
  });
});
