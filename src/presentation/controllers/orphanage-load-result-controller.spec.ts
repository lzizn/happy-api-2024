import { faker } from "@faker-js/faker";

import type { OrphanageModel } from "@/domain/models";
import type { OrphanageLoadResult } from "@/domain/usecases";

import { ServerError } from "@/presentation/errors";
import { OrphanageLoadResultController } from "@/presentation/controllers";

const makeOrphanageLoadResult = () => {
  class OrphanageLoadResultStub implements OrphanageLoadResult {
    async loadResult(): Promise<OrphanageLoadResult.Result> {
      return {} as OrphanageLoadResult.Result;
    }
  }

  return new OrphanageLoadResultStub();
};

const makeSut = () => {
  const orphanageLoadResult = makeOrphanageLoadResult();
  const sut = new OrphanageLoadResultController(orphanageLoadResult);
  const id = faker.string.uuid();

  return {
    id,
    sut,
    orphanageLoadResult,
  } as const;
};

describe("OrphanageLoadResultController", () => {
  it("Should call OrphanageLoadResult", async () => {
    const { sut, id, orphanageLoadResult } = makeSut();

    const orphanageLoadResultSpy = jest.spyOn(
      orphanageLoadResult,
      "loadResult"
    );

    await sut.handle({ orphanageId: id });
    expect(orphanageLoadResultSpy).toHaveBeenCalled();
  });

  it("Should return 500 when OrphanageLoadResult throws", async () => {
    const { sut, id, orphanageLoadResult } = makeSut();

    jest
      .spyOn(orphanageLoadResult, "loadResult")
      .mockImplementation(async () => {
        throw new Error("Caused by test");
      });

    const response = await sut.handle({ orphanageId: id });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });

  it("Should return result from OrphanageLoadResult", async () => {
    const { sut, orphanageLoadResult } = makeSut();

    const mockedOrphanage: OrphanageModel = {
      _id: "1",
      description: "aa",
      name: "Maria's Heart",
      open_on_weekends: true,
      opening_hours: "Mon-Sun 7am-7pm",
      latitude: -20,
      longitude: -40,
      instructions: "None",
    };

    const orphanageLoadResultSpy = jest.spyOn(
      orphanageLoadResult,
      "loadResult"
    );
    orphanageLoadResultSpy.mockImplementation(async () => mockedOrphanage);

    const response = await sut.handle({
      orphanageId: mockedOrphanage._id as string,
    });

    expect(orphanageLoadResultSpy).toHaveBeenCalled();
    expect(response.body).toStrictEqual({ orphanage: mockedOrphanage });
  });

  it("Should return 204 and null if response from OrphanageLoadResult is null", async () => {
    const { sut, id, orphanageLoadResult } = makeSut();

    jest
      .spyOn(orphanageLoadResult, "loadResult")
      .mockImplementation(async () => null);

    const httpResponse = await sut.handle({ orphanageId: id });

    expect(httpResponse.statusCode).toBe(204);
    expect(httpResponse.body).toBe(null);
  });
});
