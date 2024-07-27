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
      expect(response.body).toEqual(orphanagesDb);
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

      const response = await request(app)
        .post("/api/orphanages")
        .send(orphanageMock);

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: new MissingParamError(missing_param).message,
      });
    });

    it("Should return 201 and created orphanage when request is valid", async () => {
      const orphanageMock: Partial<OrphanageModel> = mockOrphanageModel();

      delete orphanageMock.id;

      const response = await request(app)
        .post("/api/orphanages")
        .send(orphanageMock);

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        id: response.body.id,
        ...orphanageMock,
      });
    });
  });

  describe("GET /orphanages/:orphanageId", () => {
    it("Should return 200 and matching orphanage", async () => {
      const { orphanagesDb } = await seedOrphanages(2);

      const orphanageTarget = orphanagesDb[0];

      const response = await request(app).get(
        `/api/orphanages/${orphanageTarget.id as string}`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(orphanageTarget);
    });

    it("Should return 204 and empty object for body when there are no matches", async () => {
      const randomId = new ObjectId().toString();
      const response = await request(app).get(`/api/orphanages/${randomId}`);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it("Should return an error when providing an invalid id", async () => {
      const invalidId = -1;
      const response = await request(app).get(`/api/orphanages/${invalidId}`);

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: "Invalid param: orphanageId" });
    });
  });

  describe("PATCH /orphanages/:orphanageId", () => {
    it("Should return 400 and Not Found Error when orphanageId does not match any item in DB", async () => {
      const { name, description, latitude } = mockOrphanageModel();

      const randomId = new ObjectId().toString();

      const response = await request(app)
        .patch(`/api/orphanages/${randomId}`)
        .send({
          name,
          description,
          latitude,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({
        error: "Resource not found. Could not find resource by orphanageId",
      });
    });

    it.skip("Should return 400 when sending request body without any orphanage field", async () => {
      const orphanageId = "zzzzzzzzzzzzzzzzzzzzzzzz";

      const response = await request(app)
        .patch(`/api/orphanages/${orphanageId}`)
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({});
    });

    it("Should return 400 when orphanageId is invalid", async () => {
      const invalidId = "123";

      const response = await request(app)
        .patch(`/api/orphanages/${invalidId}`)
        .send({
          name: "123",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: "Invalid param: orphanageId",
      });
    });

    it("Should return 200 and updated orphanage", async () => {
      const { orphanagesDb } = await seedOrphanages(1);

      const { id } = orphanagesDb[0];

      const newOrphanageData = {
        name: "my_new_name",
        description: "my_new_description",
      };

      const response = await request(app)
        .patch(`/api/orphanages/${id as string}`)
        .send(newOrphanageData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({
        ...orphanagesDb[0],
        ...newOrphanageData,
      });
    });
  });
});
