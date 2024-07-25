import request from "supertest";

import app from "@/main/config/app";

describe("Orphanages Routes", () => {
  it("Should return status 200 and list all orphanages", async () => {
    await request(app)
      .get("/api/orphanages")
      .expect(200)
      .expect("content-type", "application/json; charset=utf-8")
      .expect({ orphanages: [] });
  });
});
