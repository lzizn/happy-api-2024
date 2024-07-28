import request from "supertest";

import { app } from "@/main/config/app";

import { mockOrphanageModel } from "@/domain/mocks";
import type { OrphanageModel } from "@/domain/models";

import {
  NotFoundError,
  ValidationError,
  MissingParamError,
} from "@/presentation/errors";

import { OrphanageSeeder, Seeder } from "@/infra/db";

describe("Orphanages Routes", () => {
  let seeder: Seeder;

  beforeAll(() => {
    seeder = OrphanageSeeder();
  });

  beforeEach(async () => {
    await seeder.clean();
  });

  afterEach(async () => {
    await seeder.seed();
  });

  describe("GET /orphanages", () => {
    it("Should return 200 and list all orphanages", async () => {
      await seeder.clean();

      const { fromDb } = await seeder.seed();

      const response = await request(app).get("/api/orphanages");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(fromDb);
    });

    it("Should return 204 and empty object for body if there are no orphanages in DB", async () => {
      const response = await request(app).get("/api/orphanages");

      expect(response.body).toEqual({});
      expect(response.statusCode).toBe(204);
    });
  });

  describe("POST /orphanages", () => {
    it("Should return 400 when any required param is missing", async () => {
      const missing_param = "name";

      const orphanageMock: Partial<OrphanageModel> = mockOrphanageModel();

      delete orphanageMock[missing_param];

      const response = await request(app)
        .post("/api/orphanages")
        .send(orphanageMock);

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: MissingParamError.name,
        message: new MissingParamError(missing_param).message,
      });
    });

    it("Should return 400 containing all invalid params when there are invalid params", async () => {
      const orphanageMock: Partial<OrphanageModel> = mockOrphanageModel();

      const response = await request(app)
        .post("/api/orphanages")
        .send({
          ...orphanageMock,
          name: 123,
          latitude: { a: 1 },
          longitude: 210,
          open_on_weekends: "1",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: ValidationError.name,
        message: "Validation failed",
        errors: [
          { name: ["Expected string, received number"] },
          { latitude: ["Expected number, received object"] },
          { longitude: ["Must be greater than -180 and less than 180"] },
          { open_on_weekends: ["Expected boolean, received string"] },
        ],
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
      const { fromDb } = await seeder.seed(2);

      const orphanageTarget = fromDb[0];

      const response = await request(app).get(
        `/api/orphanages/${orphanageTarget.id as string}`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(orphanageTarget);
    });

    it("Should return ValidationError error when provided orphanageId is invalid", async () => {
      const invalidIds = [100, null, undefined, "12345678910", {}];

      for (const id of invalidIds) {
        const response = await request(app).get(`/api/orphanages/${id}`);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          error: ValidationError.name,
          message: "Validation failed",
          errors: [
            {
              orphanageId: [
                "Must be a 24-digit string that has only hex characters",
              ],
            },
          ],
        });
      }
    });

    it("Should return 204 and empty object for body when there are no matches", async () => {
      const randomId = "11a1a11d11cb1a11111fb111";
      const response = await request(app).get(`/api/orphanages/${randomId}`);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });
  });

  describe("PATCH /orphanages/:orphanageId", () => {
    it("Should return 404 and Not Found Error when orphanageId does not match any item in DB", async () => {
      const { name, description, latitude } = mockOrphanageModel();

      const randomId = "00a0a00d00cb0a00000fb000";

      const response = await request(app)
        .patch(`/api/orphanages/${randomId}`)
        .send({
          name,
          description,
          latitude,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({
        error: NotFoundError.name,
        message: new NotFoundError("orphanageId").message,
      });
    });

    it("Should return 400 with ValidationError when orphanageId is invalid", async () => {
      const orphanageId = "123";

      const response = await request(app)
        .patch(`/api/orphanages/${orphanageId}`)
        .send({
          name: "123",
        });

      expect(response.statusCode).toBe(400);

      expect(response.body).toStrictEqual({
        error: ValidationError.name,
        message: "Validation failed",
        errors: [
          {
            orphanageId: [
              "Must be a 24-digit string that has only hex characters",
            ],
          },
        ],
      });
    });

    it("Should return 200 and updated orphanage", async () => {
      const { fromDb } = await seeder.seed(1);

      const { id } = fromDb[0];

      const newOrphanageData = {
        name: "my_new_name",
        description: "my_new_description",
      };

      const response = await request(app)
        .patch(`/api/orphanages/${id as string}`)
        .send(newOrphanageData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({
        ...fromDb[0],
        ...newOrphanageData,
      });
    });
  });
});
