import { DbOrphanagesLoad } from "@/data/usecases";
import { OrphanagesLoadRepository } from "@/data/protocols";

import { OrphanageModel } from "@/domain/models";
import { mockOrphanageModels } from "@/domain/mocks";

const makeOrphanagesLoadRepositorySpy = () => {
  class OrphanagesLoadRepositorySpy implements OrphanagesLoadRepository {
    orphanagesMock: OrphanageModel[] = [];

    async loadAll(): Promise<OrphanagesLoadRepository.Result> {
      return this.orphanagesMock;
    }
  }

  return new OrphanagesLoadRepositorySpy();
};

const makeSut = () => {
  const orphanagesLoadRepository = makeOrphanagesLoadRepositorySpy();
  const sut = new DbOrphanagesLoad(orphanagesLoadRepository);

  return {
    sut,
    orphanagesLoadRepository,
  } as const;
};

describe("DbOrphanagesLoad", () => {
  // ---- OrphanageLoadRepository
  it("Should call OrphanagesLoadRepository", async () => {
    const { sut, orphanagesLoadRepository } = makeSut();

    const orphanagesLoadRepositorySpy = jest.spyOn(
      orphanagesLoadRepository,
      "loadAll"
    );

    await sut.load();

    expect(orphanagesLoadRepositorySpy).toHaveBeenCalled();
  });
  it("Should throw if OrphanageLoadRepository throws", async () => {
    const { sut, orphanagesLoadRepository } = makeSut();

    jest
      .spyOn(orphanagesLoadRepository, "loadAll")
      .mockImplementationOnce(async () => {
        throw new Error("Caused by test");
      });

    const promise = sut.load();
    await expect(promise).rejects.toThrow();
  });

  it("Should return a list of Orphanages on success", async () => {
    const { sut, orphanagesLoadRepository } = makeSut();

    const orphanagesMock = mockOrphanageModels(10);

    orphanagesLoadRepository.orphanagesMock = orphanagesMock;

    const orphanages = await sut.load();

    expect(orphanages).toEqual(orphanagesMock);
  });
});
