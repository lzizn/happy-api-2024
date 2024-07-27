import { faker } from "@faker-js/faker";
import { ObjectId } from "mongodb";

import { mockOrphanageModel } from "@/domain/mocks";
import type { OrphanageModel } from "@/domain/models";
import type { OrphanageCreate } from "@/domain/usecases";

import { badRequest } from "@/presentation/helpers";
import type { Validation } from "@/presentation/protocols";
import { ServerError, MissingParamError } from "@/presentation/errors";
import { OrphanageCreateController } from "@/presentation/controllers";

const makeValidationSpy = () => {
  class ValidationSpy implements Validation {
    error: Error | undefined;
    input: any;

    validate(input: any): Error | undefined {
      this.input = input;
      return this.error;
    }
  }

  return new ValidationSpy();
};

const makeOrphanageCreate = () => {
  class OrphanageCreateStub implements OrphanageCreate {
    async create(
      orphanage: Exclude<OrphanageModel, "id">
    ): Promise<OrphanageCreate.Result> {
      return {
        ...orphanage,
        id: new ObjectId().toString(),
      } as OrphanageCreate.Result;
    }
  }

  return new OrphanageCreateStub();
};

const makeSut = () => {
  const orphanageCreate = makeOrphanageCreate();
  const validationSpy = makeValidationSpy();
  const sut = new OrphanageCreateController(orphanageCreate, validationSpy);

  return {
    sut,
    validationSpy,
    orphanageCreate,
  } as const;
};

describe("OrphanageCreateController", () => {
  it("Should call OrphanageCreate with correct values", async () => {
    const { sut, orphanageCreate } = makeSut();

    const orphanageCreateSpy = jest.spyOn(orphanageCreate, "create");

    const request = { name: faker.lorem.word() };
    await sut.handle(request);

    expect(orphanageCreateSpy).toHaveBeenCalledWith(request);
  });

  it("Should return 500 when OrphanageCreate throws", async () => {
    const { sut, orphanageCreate } = makeSut();

    jest.spyOn(orphanageCreate, "create").mockImplementation(async () => {
      throw new Error("Caused by test");
    });

    const response = await sut.handle({});

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });

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

  it("Should return 201 and created orphanage when valid data is provided", async () => {
    const { sut } = makeSut();

    const orphanage: Partial<OrphanageModel> = mockOrphanageModel();

    delete orphanage.id;

    const response = await sut.handle(orphanage);

    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual({
      id: response.body.id,
      ...orphanage,
    });
  });

  it("Should create new orphanage even if same orphanage already exists and its 'id' is provided", async () => {
    const { sut } = makeSut();

    const orphanage: Partial<OrphanageModel> = mockOrphanageModel();

    // creating once
    const response_1 = await sut.handle({ ...orphanage });

    expect(response_1.statusCode).toBe(201);
    expect(response_1.body).toStrictEqual({
      ...orphanage,
      id: response_1.body.id,
    });

    // creating twice, by providing exact same object, including same id
    const response_2 = await sut.handle({
      ...orphanage,
      id: response_1.body.id,
    });

    expect(response_2.statusCode).toBe(201);
    expect(response_2.body).toStrictEqual({
      ...orphanage,
      id: response_2.body.id,
    });

    expect(response_1.body.id).not.toBe(response_2.body.id);
  });
});
