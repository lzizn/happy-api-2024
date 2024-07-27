import { faker } from "@faker-js/faker";
import { ObjectId } from "mongodb";

import { mockOrphanageModels } from "@/domain/mocks";
import type { OrphanageModel } from "@/domain/models";
import type { OrphanageLoadById, OrphanageUpdate } from "@/domain/usecases";

import {
  ServerError,
  NotFoundError,
  MissingParamError,
  InvalidParamError,
} from "@/presentation/errors";
import { badRequest, notFound } from "@/presentation/helpers";
import type { Validation } from "@/presentation/protocols";
import { OrphanageUpdateController } from "@/presentation/controllers";

const makeOrphanageUpdate = () => {
  class OrphanageUpdateStub implements OrphanageUpdate {
    async update(
      orphanage: Partial<OrphanageModel>
    ): Promise<OrphanageUpdate.Result> {
      return orphanage as OrphanageUpdate.Result;
    }
  }

  return new OrphanageUpdateStub();
};

const makeOrphanageLoadById = (orphanagesMocks: OrphanageModel[]) => {
  class OrphanageLoadByIdStub implements OrphanageLoadById {
    orphanagesMocks: OrphanageModel[] = orphanagesMocks;

    async loadById(orphanageId: string): Promise<OrphanageLoadById.Result> {
      const match = this.orphanagesMocks.find((x) => x.id === orphanageId);

      return match ?? null;
    }
  }

  return new OrphanageLoadByIdStub();
};

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

const makeSut = () => {
  const orphanagesMocked = mockOrphanageModels();

  const orphanageUpdate = makeOrphanageUpdate();
  const orphanageLoadById = makeOrphanageLoadById(orphanagesMocked);
  const validationSpy = makeValidationSpy();
  const sut = new OrphanageUpdateController(
    orphanageLoadById,
    orphanageUpdate,
    validationSpy
  );

  return {
    sut,
    validationSpy,
    orphanageUpdate,
    orphanagesMocked,
    orphanageLoadById,
  } as const;
};

describe("OrphanageUpdateController", () => {
  it("Should call OrphanageLoadById with correct values", async () => {
    const { sut, orphanageLoadById } = makeSut();

    const orphanageLoadByIdSpy = jest.spyOn(orphanageLoadById, "loadById");

    const request = {
      orphanageId: new ObjectId().toString(),
      orphanage: { name: faker.lorem.word() },
    };

    await sut.handle(request);

    expect(orphanageLoadByIdSpy).toHaveBeenCalledWith(request.orphanageId);
  });

  it("Should return notFound when OrphanageLoadById can not find a matching orphanage", async () => {
    const { sut, orphanageLoadById } = makeSut();

    orphanageLoadById.orphanagesMocks = [];

    const request = {
      orphanageId: new ObjectId().toString(),
      orphanage: { name: faker.lorem.word() },
    };

    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(
      notFound(new NotFoundError({ paramName: "orphanageId" }))
    );
  });

  it("Should call OrphanageUpdate with correct values", async () => {
    const { sut, orphanageUpdate, orphanagesMocked } = makeSut();

    const orphanageUpdateSpy = jest.spyOn(orphanageUpdate, "update");

    const request = {
      orphanageId: orphanagesMocked[0].id as string,
      name: faker.lorem.word(),
    };

    await sut.handle(request);

    expect(orphanageUpdateSpy).toHaveBeenCalledWith({
      id: orphanagesMocked[0].id,
      name: request.name,
    });
  });

  it("Should return 500 when OrphanageUpdate throws", async () => {
    const { sut, orphanageUpdate, orphanagesMocked } = makeSut();

    jest.spyOn(orphanageUpdate, "update").mockImplementation(async () => {
      throw new Error("Caused by test");
    });

    const request = {
      orphanageId: orphanagesMocked[0].id as string,
      orphanage: { name: faker.lorem.word() },
    };

    const httpResponse = await sut.handle(request);

    expect(httpResponse.body).toEqual(new ServerError());
    expect(httpResponse.statusCode).toBe(500);
  });

  it("Should call Validation with correct value", async () => {
    const { sut, validationSpy } = makeSut();

    const request = {
      orphanageId: "123",
      orphanage: { name: faker.lorem.word() },
    };
    await sut.handle(request);

    expect(validationSpy.input).toEqual(request);
  });

  it("Should return 400 if Validation returns an error", async () => {
    const { sut, validationSpy } = makeSut();

    validationSpy.error = new MissingParamError("orphanageId");

    const httpResponse = await sut.handle({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      orphanageId: undefined,
      orphanage: { name: faker.lorem.word({ length: 5 }) },
    });

    expect(httpResponse).toEqual(badRequest(validationSpy.error));
  });

  it.skip("Should return 400 if one did not provide at least one orphanage field", async () => {
    const { sut } = makeSut();

    const [{ id }] = mockOrphanageModels(1);

    const httpResponse = await sut.handle({
      orphanageId: id as string,
    });

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual({});
  });

  it("Should return 400 if orphanageId is invalid", async () => {
    const { sut } = makeSut();

    const invalidId = "123";

    const httpResponse = await sut.handle({
      orphanageId: invalidId,
      name: faker.lorem.word({ length: 5 }),
    });

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("orphanageId"));
  });

  it("Should return 200 and updated orphanage when valid data is provided", async () => {
    const { sut, orphanagesMocked } = makeSut();

    const [orphanageNewData] = mockOrphanageModels(1);

    const request = {
      orphanageId: orphanagesMocked[0].id as string,
      ...orphanageNewData,
    };

    const httpResponse = await sut.handle(request);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toStrictEqual({
      ...orphanageNewData,
      id: orphanagesMocked[0].id,
    });
  });
});
