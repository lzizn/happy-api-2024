import request from "supertest";
import { ObjectId } from "mongodb";

import { app } from "@/main/config/app";

import { mockOrphanageModel } from "@/domain/mocks";
import type { OrphanageModel } from "@/domain/models";

import { MissingParamError } from "@/presentation/errors";

import { cleanOrphanagesSeed, seedOrphanages } from "@/infra/db";

describe("Orphanages Routes", () => {
  beforeEach(async () => {
    await cleanOrphanagesSeed();
  });

  afterEach(async () => {
    await cleanOrphanagesSeed();
  });

  describe("GET /orphanages", () => {
    it("Should return 200 and list all orphanages", async () => {
      await cleanOrphanagesSeed();

      const { orphanagesDb } = await seedOrphanages();

      const response = await request(app).get("/api/orphanages");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ orphanages: orphanagesDb });
    });

    it("Should return 204 and empty object for body if there are no orphanages in DB", async () => {
      const response = await request(app).get("/api/orphanages");

      expect(response.body).toEqual({});
      expect(response.statusCode).toBe(204);
    });
  });

  describe("POST /orphanages", () => {
    it("Should return 400 when creating orphanage without any required param", async () => {
      const missing_param = "name";

      const orphanageMock: Partial<OrphanageModel> = mockOrphanageModel();

      delete orphanageMock[missing_param];

      const response = await request(app).post("/api/orphanages").send({
        orphanage: orphanageMock,
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: new MissingParamError(missing_param).message,
      });
    });

    it("Should return 201 and created orphanage when request is valid", async () => {
      const orphanageMock: Partial<OrphanageModel> = mockOrphanageModel();

      delete orphanageMock.id;

      const response = await request(app).post("/api/orphanages").send({
        orphanage: orphanageMock,
      });

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        orphanage: {
          id: response.body.orphanage.id,
          ...orphanageMock,
        },
      });
    });
  });

  describe("GET /orphanages/:orphanageId", () => {
    describe("Assuming orphanages in DB", () => {
      it("Should return 200 and matching orphanage", async () => {
        const { orphanagesDb } = await seedOrphanages(2);

        const orphanageTarget = orphanagesDb[0];

        const response = await request(app).get(
          `/api/orphanages/${orphanageTarget.id as string}`
        );

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ orphanage: orphanageTarget });
      });
    });

    it("Should return 204 and empty object for body when there are no matches", async () => {
      const randomId = new ObjectId().toString();
      const response = await request(app).get(`/api/orphanages/${randomId}`);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it("Should return return an error when providing an invalid id", async () => {
      const invalidId = -1;
      const response = await request(app).get(`/api/orphanages/${invalidId}`);

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: "Invalid param: orphanageId" });
    });
  });
});
