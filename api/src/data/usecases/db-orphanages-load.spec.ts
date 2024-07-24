import { DbOrphanagesLoad } from "./db-orphanages-load";

import { OrphanagesLoadRepository } from "@/data/protocols";
import { mockOrphanageModels } from "@/domain/mocks/mock-orphanages";

const makeOrphanagesLoadRepository = () => {
  class OrphanagesLoadRepositoryStub implements OrphanagesLoadRepository {
    result: OrphanagesLoadRepository.Result = [];

    async loadAll(): Promise<OrphanagesLoadRepository.Result> {
      const result = mockOrphanageModels(1);
      this.result = result;
      return result;
    }
  }

  return new OrphanagesLoadRepositoryStub();
};

const makeSut = () => {
  const orphanagesLoadRepository = makeOrphanagesLoadRepository();
  const sut = new DbOrphanagesLoad(orphanagesLoadRepository);

  return {
    sut,
    orphanagesLoadRepository,
  } as const;
};

describe("DbOrphanagesLoad", () => {
  test("Should call LoadSurveysRepository", async () => {
    const { sut, orphanagesLoadRepository } = makeSut();

    const orphanagesLoadRepositorySpy = jest.spyOn(
      orphanagesLoadRepository,
      "loadAll"
    );

    await sut.load();

    expect(orphanagesLoadRepositorySpy).toHaveBeenCalled();
  });

  test("Should return a list of Orphanages on success", async () => {
    const { sut, orphanagesLoadRepository } = makeSut();

    const orphanages = await sut.load();

    expect(orphanages).toEqual(orphanagesLoadRepository.result);
  });

  test("Should throw if LoadSurveysRepository throws", async () => {
    const { sut, orphanagesLoadRepository } = makeSut();

    jest
      .spyOn(orphanagesLoadRepository, "loadAll")
      .mockImplementationOnce(async () => {
        throw new Error("Caused by test");
      });

    const promise = sut.load();
    await expect(promise).rejects.toThrow();
  });
});
