import { faker } from "@faker-js/faker";
import { ObjectId } from "mongodb";

import { SchemaValidator } from "@/data/protocols/db";

import { mockOrphanageModels } from "@/domain/mocks";
import type { OrphanageModel } from "@/domain/models";
import type { OrphanageLoadById, OrphanageUpdate } from "@/domain/usecases";

import {
  NotFoundError,
  ValidationError,
  MissingParamError,
} from "@/presentation/errors";
import type { Validation } from "@/presentation/protocols";
import { ok, badRequest, notFound } from "@/presentation/helpers";
import { OrphanageUpdateController } from "@/presentation/controllers";

const makeOrphanageUpdateSchemaValidatorSpy = () => {
  class OrphanageUpdateSchemaValidatorSpy
    implements SchemaValidator<OrphanageModel>
  {
    input: OrphanageModel | Partial<OrphanageModel> = {};
    validate(
      orphanage: OrphanageModel | Partial<OrphanageModel>
    ): SchemaValidator.Result<OrphanageModel> {
      this.input = orphanage;
      return;
    }
  }

  return new OrphanageUpdateSchemaValidatorSpy();
};

const makeOrphanageUpdateSpy = (
  schemaValidator: SchemaValidator<OrphanageModel>
) => {
  class OrphanageUpdateSpy implements OrphanageUpdate {
    input: Partial<OrphanageModel> = {};

    async update(
      orphanage: Partial<OrphanageModel>
    ): Promise<OrphanageUpdate.Result> {
      this.input = orphanage;

      const error = schemaValidator.validate(orphanage);

      if (error) throw error;

      return orphanage as OrphanageUpdate.Result;
    }
  }

  return new OrphanageUpdateSpy();
};

const makeOrphanageLoadByIdSpy = (orphanagesMocks: OrphanageModel[]) => {
  class OrphanageLoadByIdSpy implements OrphanageLoadById {
    orphanagesMocks: OrphanageModel[] = orphanagesMocks;
    input: string = "";

    async loadById(orphanageId: string): Promise<OrphanageLoadById.Result> {
      this.input = orphanageId;

      const match = this.orphanagesMocks.find((x) => x.id === orphanageId);

      return match ?? null;
    }
  }

  return new OrphanageLoadByIdSpy();
};

const makeRequestValidationSpy = () => {
  class RequestValidationSpy implements Validation {
    error: Error | undefined;
    input: any;

    validate(input: any): Error | undefined {
      this.input = input;
      return this.error;
    }
  }

  return new RequestValidationSpy();
};

const makeSut = () => {
  const orphanagesMocked = mockOrphanageModels();

  const schemaValidatorSpy = makeOrphanageUpdateSchemaValidatorSpy();
  const orphanageUpdateSpy = makeOrphanageUpdateSpy(schemaValidatorSpy);
  const orphanageLoadByIdSpy = makeOrphanageLoadByIdSpy(orphanagesMocked);
  const requestValidationSpy = makeRequestValidationSpy();

  const sut = new OrphanageUpdateController(
    orphanageLoadByIdSpy,
    orphanageUpdateSpy,
    requestValidationSpy
  );

  return {
    sut,
    orphanagesMocked,
    schemaValidatorSpy,
    orphanageUpdateSpy,
    orphanageLoadByIdSpy,
    requestValidationSpy,
  } as const;
};

describe("OrphanageUpdateController", () => {
  // ---- RequestValidation
  it("Should call RequestValidation with correct value", async () => {
    const { sut, requestValidationSpy } = makeSut();

    const request = {
      orphanageId: "123",
      name: faker.lorem.word(),
    };
    await sut.handle(request);

    expect(requestValidationSpy.input).toEqual(request);
  });
  it("Should return 400 if RequestValidation returns an error", async () => {
    const { sut, requestValidationSpy } = makeSut();

    requestValidationSpy.error = new MissingParamError("orphanageId");

    const httpResponse = await sut.handle({
      // @ts-expect-error
      orphanageId: undefined,
      name: faker.lorem.word({ length: 5 }),
    });

    expect(httpResponse).toEqual(badRequest(requestValidationSpy.error));
  });

  // ---- OrphanageLoadById
  it("Should call OrphanageLoadById with correct values", async () => {
    const { sut, orphanageLoadByIdSpy } = makeSut();

    const request = {
      orphanageId: new ObjectId().toString(),
      name: faker.lorem.word(),
    };

    await sut.handle(request);

    expect(orphanageLoadByIdSpy.input).toEqual(request.orphanageId);
  });
  it("Should return notFound when OrphanageLoadById can not find a matching orphanage", async () => {
    const { sut, orphanageLoadByIdSpy } = makeSut();

    orphanageLoadByIdSpy.orphanagesMocks = [];

    const request = {
      orphanageId: new ObjectId().toString(),
      name: faker.lorem.word(),
    };

    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(notFound(new NotFoundError("orphanageId")));
  });
  it("Should throw if orphanageId is invalid", async () => {
    const { sut, orphanageLoadByIdSpy } = makeSut();

    const validationError = new ValidationError<{ id: string[] }>([
      { id: ["Must be a 24-digit string that has only hex characters"] },
    ]);
    jest.spyOn(orphanageLoadByIdSpy, "loadById").mockImplementationOnce(() => {
      throw validationError;
    });

    const invalidId = "123";

    try {
      await sut.handle({
        orphanageId: invalidId,
        name: faker.lorem.word({ length: 5 }),
      });
    } catch (e) {
      expect(e).toEqual(validationError);
    }
  });

  // ---- DbOrphanageUpdate
  it("Should call OrphanageUpdate with correct values", async () => {
    const { sut, orphanageUpdateSpy, orphanagesMocked } = makeSut();

    const request = {
      orphanageId: orphanagesMocked[0].id as string,
      name: faker.lorem.word(),
    };

    await sut.handle(request);

    expect(orphanageUpdateSpy.input).toEqual({
      id: orphanagesMocked[0].id,
      name: request.name,
    });
  });
  it("Should throw when OrphanageUpdate throws", async () => {
    const { sut, orphanageUpdateSpy, orphanagesMocked } = makeSut();

    const error = new Error("Caused by test");
    jest.spyOn(orphanageUpdateSpy, "update").mockImplementation(async () => {
      throw error;
    });

    const request = {
      orphanageId: orphanagesMocked[0].id as string,
      name: faker.lorem.word(),
    };

    try {
      await sut.handle(request);
    } catch (e) {
      expect(e).toEqual(error);
    }
  });

  // ---- OrphanageSchemaValidation
  it("Should call SchemaValidation with correct value", async () => {
    const { sut, orphanageLoadByIdSpy, schemaValidatorSpy } = makeSut();

    const orphanageMocks = mockOrphanageModels(1);

    orphanageLoadByIdSpy.orphanagesMocks = orphanageMocks;

    const request = {
      orphanageId: orphanageMocks[0].id as string,
      name: faker.lorem.word(),
    };

    await sut.handle(request);

    expect(schemaValidatorSpy.input).toEqual({
      id: request.orphanageId,
      name: request.name,
    });
  });
  it("Should throw when SchemaValidation returns a ValidationError", async () => {
    const { sut, orphanageLoadByIdSpy, schemaValidatorSpy } = makeSut();

    const orphanageMock = mockOrphanageModels(1);

    orphanageLoadByIdSpy.orphanagesMocks = orphanageMock;

    const validationError = new ValidationError<{ error: string[] }>([
      { error: ["Caused by test"] },
    ]);

    jest.spyOn(schemaValidatorSpy, "validate").mockImplementationOnce(() => {
      throw validationError;
    });

    try {
      await sut.handle({
        orphanageId: orphanageMock[0].id as string,
      });
    } catch (e) {
      expect(e).toEqual(validationError);
    }
  });

  // ---- General
  it("Should return 200 and updated orphanage when valid data is provided", async () => {
    const { sut, orphanagesMocked } = makeSut();

    const [orphanageNewData] = mockOrphanageModels(1);

    const request = {
      orphanageId: orphanagesMocked[0].id as string,
      ...orphanageNewData,
    };

    const httpResponse = await sut.handle(request);

    const expectedData = {
      ...orphanageNewData,
      id: orphanagesMocked[0].id,
    };

    expect(httpResponse).toEqual(ok(expectedData));
  });
});
