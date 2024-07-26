import { faker } from "@faker-js/faker";
import { ObjectId } from "mongodb";

import type { OrphanageModel } from "@/domain/models";
import { mockOrphanageModels } from "@/domain/mocks";
import type { OrphanageLoadById, OrphanageUpdate } from "@/domain/usecases";

import { NotFoundError, ServerError } from "@/presentation/errors";
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

const makeSut = () => {
  const orphanagesMocked = mockOrphanageModels();

  const orphanageUpdate = makeOrphanageUpdate();
  const orphanageLoadById = makeOrphanageLoadById(orphanagesMocked);

  const sut = new OrphanageUpdateController(orphanageLoadById, orphanageUpdate);

  return {
    sut,
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

  it("Should return 400 when OrphanageLoadById can not find a matching orphanage", async () => {
    const { sut, orphanageLoadById } = makeSut();

    orphanageLoadById.orphanagesMocks = [];

    const request = {
      orphanageId: new ObjectId().toString(),
      orphanage: { name: faker.lorem.word() },
    };

    const response = await sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(
      new NotFoundError({ paramName: "orphanageId" })
    );
  });

  it("Should call OrphanageUpdate with correct values", async () => {
    const { sut, orphanageUpdate, orphanagesMocked } = makeSut();

    const orphanageUpdateSpy = jest.spyOn(orphanageUpdate, "update");

    const request = {
      orphanageId: orphanagesMocked[0].id as string,
      orphanage: { name: faker.lorem.word() },
    };

    await sut.handle(request);
    expect(orphanageUpdateSpy).toHaveBeenCalledWith({
      id: orphanagesMocked[0].id,
      ...request.orphanage,
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

    const response = await sut.handle(request);

    expect(response.body).toEqual(new ServerError());
    expect(response.statusCode).toBe(500);
  });

  it("Should return 200 and updated orphanage when valid data is provided", async () => {
    const { sut, orphanagesMocked } = makeSut();

    const [orphanageNewData] = mockOrphanageModels(1);

    const request = {
      orphanageId: orphanagesMocked[0].id as string,
      orphanage: orphanageNewData,
    };

    const response = await sut.handle(request);

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      orphanage: {
        ...orphanageNewData,
        id: orphanagesMocked[0].id,
      },
    });
  });
});
