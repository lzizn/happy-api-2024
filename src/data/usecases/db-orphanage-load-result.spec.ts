import { ObjectId } from "mongodb";

import { OrphanageModel } from "@/domain/models";
import { mockOrphanageModels } from "@/domain/mocks";

import { DbOrphanageLoadResult } from "@/data/usecases";
import { OrphanageLoadResultRepository } from "@/data/protocols";

const makeOrphanageLoadResultRepository = () => {
  class OrphanageLoadResultRepositoryStub
    implements OrphanageLoadResultRepository
  {
    orphanages: OrphanageModel[] = mockOrphanageModels(10);
    result: OrphanageLoadResultRepository.Result = null;

    async loadResult(
      orphanageId: string | ObjectId
    ): Promise<OrphanageLoadResultRepository.Result> {
      const orphanage =
        this.orphanages.find((x) => x._id === orphanageId) ?? null;

      this.result = orphanage;
      return orphanage;
    }
  }

  return new OrphanageLoadResultRepositoryStub();
};

const makeSut = () => {
  const orphanageLoadResultRepository = makeOrphanageLoadResultRepository();
  const sut = new DbOrphanageLoadResult(orphanageLoadResultRepository);

  return {
    sut,
    orphanageLoadResultRepository,
  } as const;
};

describe("DbOrphanageLoadResult", () => {
  test("Should call OrphanageLoadResult", async () => {
    const { sut, orphanageLoadResultRepository } = makeSut();

    const orphanageLoadResultRepositorySpy = jest.spyOn(
      orphanageLoadResultRepository,
      "loadResult"
    );

    await sut.loadResult("123");

    expect(orphanageLoadResultRepositorySpy).toHaveBeenCalled();
  });

  test("Should return an orphanage that matches provided id", async () => {
    const { sut, orphanageLoadResultRepository } = makeSut();

    const uuid = orphanageLoadResultRepository.orphanages[0]._id;

    const orphanage = await sut.loadResult(uuid as string);

    expect(orphanage).toEqual(orphanageLoadResultRepository.result);
  });

  test("Should throw if OrphanageLoadResultRepository throws", async () => {
    const { sut, orphanageLoadResultRepository } = makeSut();

    jest
      .spyOn(orphanageLoadResultRepository, "loadResult")
      .mockImplementationOnce(async () => {
        throw new Error("Caused by test");
      });

    const promise = sut.loadResult("123");
    await expect(promise).rejects.toThrow();
  });
});
