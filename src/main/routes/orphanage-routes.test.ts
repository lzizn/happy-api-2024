import request from "supertest";

import { app } from "@/main/config/app";
import { cleanOrphanagesSeed, MongoHelper, seedOrphanages } from "@/infra/db";

describe("Orphanages Routes", () => {
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
