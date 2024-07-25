import { DbOrphanageLoadResult } from "@/data/usecases";

import { mockOrphanageModels } from "@/domain/mocks";
import { OrphanageLoadResultRepository } from "@/data/protocols";
import { OrphanageModel } from "@/domain/models";

const makeOrphanagesLoadResultRepository = () => {
  class OrphanageLoadResultRepositoryStub
    implements OrphanageLoadResultRepository
  {
    orphanages: OrphanageModel[] = mockOrphanageModels(10);
    result: OrphanageLoadResultRepository.Result = null;

    async loadResult(
      orphanageId: string
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
  const orphanagesLoadResultRepository = makeOrphanagesLoadResultRepository();
  const sut = new DbOrphanageLoadResult(orphanagesLoadResultRepository);

  return {
    sut,
    orphanagesLoadResultRepository,
  } as const;
};

describe("DbOrphanageLoadResult", () => {
  test("Should call OrphanageLoadResult", async () => {
    const { sut, orphanagesLoadResultRepository } = makeSut();

    const orphanagesLoadResultRepositorySpy = jest.spyOn(
      orphanagesLoadResultRepository,
      "loadResult"
    );

    await sut.loadResult("123");

    expect(orphanagesLoadResultRepositorySpy).toHaveBeenCalled();
  });

  test("Should return an orphanage that matches provided id", async () => {
    const { sut, orphanagesLoadResultRepository } = makeSut();

    const uuid = orphanagesLoadResultRepository.orphanages[0]._id;

    const orphanage = await sut.loadResult(uuid as string);

    expect(orphanage).toEqual(orphanagesLoadResultRepository.result);
  });

  test("Should throw if OrphanageLoadResultRepository throws", async () => {
    const { sut, orphanagesLoadResultRepository } = makeSut();

    jest
      .spyOn(orphanagesLoadResultRepository, "loadResult")
      .mockImplementationOnce(async () => {
        throw new Error("Caused by test");
      });

    const promise = sut.loadResult("123");
    await expect(promise).rejects.toThrow();
  });
});
