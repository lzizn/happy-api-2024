import { faker } from "@faker-js/faker";

import { mockOrphanageModel } from "@/domain/mocks";
import type { OrphanageModel } from "@/domain/models";
import type { OrphanageCreate } from "@/domain/usecases";

import type { SchemaValidator } from "@/data/protocols/db";

import type { Validation } from "@/presentation/protocols";
import { badRequest, created } from "@/presentation/helpers";
import { OrphanageCreateController } from "@/presentation/controllers";
import { MissingParamError, ValidationError } from "@/presentation/errors";

const makeOrphanageCreateSchemaValidatorSpy = () => {
  class OrphanageCreateSchemaValidatorSpy
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

  return new OrphanageCreateSchemaValidatorSpy();
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

const makeOrphanageCreateSpy = (
  schemaValidatorSpy: SchemaValidator<OrphanageModel>
) => {
  class OrphanageCreateStub implements OrphanageCreate {
    input: Exclude<OrphanageModel, "id"> | undefined;

    async create(
      orphanage: Exclude<OrphanageModel, "id">
    ): Promise<OrphanageCreate.Result> {
      this.input = orphanage;

      const error = schemaValidatorSpy.validate(orphanage);

      if (error) throw error;

      return {
        ...orphanage,
        id: "mocked_id" + Math.random() * 1000,
      } as OrphanageCreate.Result;
    }
  }

  return new OrphanageCreateStub();
};

const makeSut = () => {
  const schemaValidatorSpy = makeOrphanageCreateSchemaValidatorSpy();
  const orphanageCreateSpy = makeOrphanageCreateSpy(schemaValidatorSpy);
  const validationSpy = makeRequestValidationSpy();
  const sut = new OrphanageCreateController(orphanageCreateSpy, validationSpy);

  return {
    sut,
    validationSpy,
    orphanageCreateSpy,
    schemaValidatorSpy,
  } as const;
};

describe("OrphanageCreateController", () => {
  // ---- RequestValidation
  it("Should call Validation with correct value", async () => {
    const { sut, validationSpy } = makeSut();

    const request = { name: faker.lorem.word() };
    await sut.handle(request);

    expect(validationSpy.input).toEqual(request);
  });
  it("Should return 400 if Validation returns an error", async () => {
    const { sut, validationSpy } = makeSut();

    validationSpy.error = new MissingParamError("instructions");

    const httpResponse = await sut.handle({
      name: faker.lorem.word({ length: 5 }),
    });

    expect(httpResponse).toEqual(badRequest(validationSpy.error));
  });

  // ---- OrphanageCreateSchemaValidator
  it("Should call OrphanageCreateSchemaValidator with correct values", async () => {
    const { sut, schemaValidatorSpy } = makeSut();

    const request = { name: faker.lorem.word() };
    await sut.handle(request);

    expect(schemaValidatorSpy.input).toEqual(request);
  });
  it("Should throw when OrphanageCreateSchemaValidator returns a ValidationError", async () => {
    const { sut, schemaValidatorSpy } = makeSut();

    const validationError = new ValidationError<{ error: string[] }>([
      {
        error: ["Caused by test"],
      },
    ]);

    jest.spyOn(schemaValidatorSpy, "validate").mockImplementation(() => {
      return validationError;
    });

    try {
      await sut.handle({});
    } catch (e) {
      expect(e).toEqual(validationError);
    }
  });

  // ---- OrphanageCreate
  it("Should call OrphanageCreate with correct values", async () => {
    const { sut, orphanageCreateSpy } = makeSut();

    const request = { name: faker.lorem.word() };
    await sut.handle(request);

    expect(orphanageCreateSpy.input).toEqual(request);
  });
  it("Should return 500 when OrphanageCreate throws", async () => {
    const { sut, orphanageCreateSpy } = makeSut();

    const error = new Error("Caused by test");
    jest.spyOn(orphanageCreateSpy, "create").mockImplementation(async () => {
      throw error;
    });

    try {
      await sut.handle({});
    } catch (e) {
      expect(e).toEqual(error);
    }
  });

  // ---- General
  it("Should return 201 and created orphanage when valid data is provided", async () => {
    const { sut } = makeSut();

    const orphanage: Partial<OrphanageModel> = mockOrphanageModel();

    delete orphanage.id;

    const response = await sut.handle(orphanage);

    const expectedData = {
      ...orphanage,
      id: response.body.id,
    };

    expect(response).toEqual(created(expectedData));
  });
  it("Should create new orphanage even if same orphanage already exists and its 'id' is provided", async () => {
    const { sut } = makeSut();

    const orphanage: Partial<OrphanageModel> = mockOrphanageModel();

    // creating once
    const response_1 = await sut.handle({ ...orphanage });

    expect(response_1).toEqual(
      created({
        ...orphanage,
        id: response_1.body.id,
      })
    );

    // creating twice, by providing exact same object, including same id
    const response_2 = await sut.handle({
      ...orphanage,
      id: response_1.body.id,
    });

    expect(response_2).toEqual(
      created({
        ...orphanage,
        id: response_2.body.id,
      })
    );

    expect(response_1.body.id).not.toBe(response_2.body.id);
  });
});
