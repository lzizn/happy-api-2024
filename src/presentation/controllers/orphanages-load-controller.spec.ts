import { mockOrphanageModels } from "@/domain/mocks";
import type { OrphanagesLoad } from "@/domain/usecases";

import { noContent, ok } from "@/presentation/helpers";
import { OrphanagesLoadController } from "@/presentation/controllers";

const makeOrphanagesLoad = () => {
  class OrphanagesLoadStub implements OrphanagesLoad {
    async load(): Promise<OrphanagesLoad.Result> {
      return [];
    }
  }

  return new OrphanagesLoadStub();
};

const makeSut = () => {
  const orphanagesLoad = makeOrphanagesLoad();
  const sut = new OrphanagesLoadController(orphanagesLoad);

  return {
    sut,
    orphanagesLoad,
  } as const;
};

describe("OrphanagesLoadController", () => {
  // ---- OrphanagesLoad
  it("Should call OrphanagesLoad", async () => {
    const { sut, orphanagesLoad } = makeSut();

    const orphanagesLoadSpy = jest.spyOn(orphanagesLoad, "load");

    await sut.handle();
    expect(orphanagesLoadSpy).toHaveBeenCalled();
  });
  it("Should throw when OrphanagesLoad throws", async () => {
    const { sut, orphanagesLoad } = makeSut();

    const error = new Error("Caused by test");

    jest.spyOn(orphanagesLoad, "load").mockImplementation(async () => {
      throw error;
    });

    try {
      await sut.handle();
    } catch (e) {
      expect(e).toEqual(error);
    }
  });
  it("Should return results from OrphanagesLoad", async () => {
    const { sut, orphanagesLoad } = makeSut();

    const orphanagesMocked = mockOrphanageModels(2);
    const orphanagesLoadSpy = jest.spyOn(orphanagesLoad, "load");
    orphanagesLoadSpy.mockImplementation(async () => orphanagesMocked);

    const response = await sut.handle();

    expect(orphanagesLoadSpy).toHaveBeenCalled();
    expect(response.body).toStrictEqual(orphanagesMocked);
  });

  // ---- General
  it("Should return 200 when there is at least one orphanage", async () => {
    const { sut, orphanagesLoad } = makeSut();

    const orphanagesMocked = mockOrphanageModels(2);
    jest
      .spyOn(orphanagesLoad, "load")
      .mockImplementation(async () => orphanagesMocked);

    const response = await sut.handle();

    expect(response).toEqual(ok(orphanagesMocked));
  });
  it("Should return 204 and null if response from OrphanagesLoad is empty", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle();

    expect(httpResponse).toEqual(noContent());
  });
});
