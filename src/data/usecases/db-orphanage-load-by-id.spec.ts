import { ObjectId } from "mongodb";

import { OrphanageModel } from "@/domain/models";
import { mockOrphanageModels } from "@/domain/mocks";

import { DbOrphanageLoadById } from "@/data/usecases";
import { OrphanageLoadByIdRepository } from "@/data/protocols";

const makeOrphanageLoadByIdRepository = () => {
  class OrphanageLoadByIdRepositoryStub implements OrphanageLoadByIdRepository {
    orphanagesMocked: OrphanageModel[] = mockOrphanageModels(10);
    result: OrphanageLoadByIdRepository.Result = null;

    async loadById(
      orphanageId: string | ObjectId
    ): Promise<OrphanageLoadByIdRepository.Result> {
      const orphanage =
        this.orphanagesMocked.find((x) => x.id === orphanageId) ?? null;

      this.result = orphanage;
      return orphanage;
    }
  }

  return new OrphanageLoadByIdRepositoryStub();
};

const makeSut = () => {
  const orphanageLoadByIdRepository = makeOrphanageLoadByIdRepository();
  const sut = new DbOrphanageLoadById(orphanageLoadByIdRepository);

  return {
    sut,
    orphanageLoadByIdRepository,
  } as const;
};

describe("DbOrphanageLoadById", () => {
  test("Should call OrphanageLoadById", async () => {
    const { sut, orphanageLoadByIdRepository } = makeSut();

    const orphanageLoadByIdRepositorySpy = jest.spyOn(
      orphanageLoadByIdRepository,
      "loadById"
    );

    await sut.loadById("123");

    expect(orphanageLoadByIdRepositorySpy).toHaveBeenCalled();
  });

  test("Should return an orphanage that matches provided id", async () => {
    const { sut, orphanageLoadByIdRepository } = makeSut();

    const mockedOrphanageId =
      orphanageLoadByIdRepository.orphanagesMocked[0].id;

    const orphanage = await sut.loadById(mockedOrphanageId as string);

    expect(orphanage).toEqual(orphanageLoadByIdRepository.result);
  });

  test("Should throw if OrphanageLoadByIdRepository throws", async () => {
    const { sut, orphanageLoadByIdRepository } = makeSut();

    jest
      .spyOn(orphanageLoadByIdRepository, "loadById")
      .mockImplementationOnce(async () => {
        throw new Error("Caused by test");
      });

    const promise = sut.loadById("123");
    await expect(promise).rejects.toThrow();
  });
});
