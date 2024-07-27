import { ObjectId } from "mongodb";

import type { OrphanageModel } from "@/domain/models";
import type { OrphanageLoadById } from "@/domain/usecases";

import {
  ServerError,
  InvalidParamError,
  MissingParamError,
} from "@/presentation/errors";
import { OrphanageLoadByIdController } from "@/presentation/controllers";

const makeOrphanageLoadById = () => {
  class OrphanageLoadByIdStub implements OrphanageLoadById {
    async loadById(): Promise<OrphanageLoadById.Result> {
      return {} as OrphanageLoadById.Result;
    }
  }

  return new OrphanageLoadByIdStub();
};

const makeSut = () => {
  const orphanageLoadById = makeOrphanageLoadById();
  const sut = new OrphanageLoadByIdController(orphanageLoadById);
  const id = new ObjectId().toString();

  return {
    id,
    sut,
    orphanageLoadById,
  } as const;
};

describe("OrphanageLoadByIdController", () => {
  it("Should call OrphanageLoadById", async () => {
    const { sut, id, orphanageLoadById } = makeSut();

    const orphanageLoadByIdSpy = jest.spyOn(orphanageLoadById, "loadById");

    await sut.handle({ orphanageId: id });
    expect(orphanageLoadByIdSpy).toHaveBeenCalled();
  });

  it("Should return 400 with InvalidParamError when orphanageId is null", async () => {
    const { sut } = makeSut();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response = await sut.handle({ orphanageId: null });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new InvalidParamError("orphanageId"));
  });

  it("Should return 400 with MissingParamError when orphanageId is undefined", async () => {
    const { sut } = makeSut();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response = await sut.handle({ orphanageId: undefined });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamError("orphanageId"));
  });

  it("Should return 500 when OrphanageLoadById throws", async () => {
    const { sut, id, orphanageLoadById } = makeSut();

    jest.spyOn(orphanageLoadById, "loadById").mockImplementation(async () => {
      throw new Error("Caused by test");
    });

    const response = await sut.handle({ orphanageId: id });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });

  it("Should return result from OrphanageLoadById", async () => {
    const { sut, orphanageLoadById } = makeSut();

    const mockedOrphanage: OrphanageModel = {
      id: new ObjectId().toString(),
      description: "aa",
      name: "Maria's Heart",
      open_on_weekends: true,
      opening_hours: "Mon-Sun 7am-7pm",
      latitude: -20,
      longitude: -40,
      instructions: "None",
    };

    const orphanageLoadByIdSpy = jest.spyOn(orphanageLoadById, "loadById");
    orphanageLoadByIdSpy.mockImplementation(async () => mockedOrphanage);

    const response = await sut.handle({
      orphanageId: mockedOrphanage.id as string,
    });

    expect(orphanageLoadByIdSpy).toHaveBeenCalled();
    expect(response.body).toStrictEqual(mockedOrphanage);
  });

  it("Should return 204 and null if response from OrphanageLoadById is null", async () => {
    const { sut, id, orphanageLoadById } = makeSut();

    jest
      .spyOn(orphanageLoadById, "loadById")
      .mockImplementation(async () => null);

    const httpResponse = await sut.handle({ orphanageId: id });

    expect(httpResponse.statusCode).toBe(204);
    expect(httpResponse.body).toBe(null);
  });
});
