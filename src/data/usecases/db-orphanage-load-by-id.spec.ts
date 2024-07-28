import { OrphanageModel } from "@/domain/models";
import { mockOrphanageModels } from "@/domain/mocks";

import { DbOrphanageLoadById } from "@/data/usecases";
import { OrphanageLoadByIdRepository } from "@/data/protocols";
import { ValidationError } from "@/presentation/errors";

const makeOrphanageLoadByIdRepositorySpy = () => {
  class OrphanageLoadByIdRepositorySpy implements OrphanageLoadByIdRepository {
    orphanagesMocked: OrphanageModel[] = [];
    result: OrphanageLoadByIdRepository.Result = null;
    input?: string;

    async loadById(
      orphanageId: string
    ): Promise<OrphanageLoadByIdRepository.Result> {
      this.input = orphanageId;

      const orphanage =
        this.orphanagesMocked.find((x) => x.id === orphanageId) ?? null;

      return orphanage;
    }
  }

  return new OrphanageLoadByIdRepositorySpy();
};

const makeSut = () => {
  const [{ id }] = mockOrphanageModels(1);
  const orphanageLoadByIdRepositorySpy = makeOrphanageLoadByIdRepositorySpy();
  const sut = new DbOrphanageLoadById(orphanageLoadByIdRepositorySpy);

  return {
    sut,
    id: id as string,
    orphanageLoadByIdRepositorySpy,
  } as const;
};

describe("DbOrphanageLoadById", () => {
  // ---- OrphanageLoadByIdRepository
  it("Should call OrphanageLoadById", async () => {
    const { sut, id, orphanageLoadByIdRepositorySpy } = makeSut();

    await sut.loadById(id);

    expect(orphanageLoadByIdRepositorySpy.input).toBe(id);
  });
  it("Should throw if OrphanageLoadByIdRepository throws", async () => {
    const { sut, id, orphanageLoadByIdRepositorySpy } = makeSut();

    jest
      .spyOn(orphanageLoadByIdRepositorySpy, "loadById")
      .mockImplementationOnce(async () => {
        throw new Error("Caused by test");
      });

    const promise = sut.loadById(id);
    await expect(promise).rejects.toThrow();
  });

  // ---- General
  it("Should throw when orphanageId is invalid", async () => {
    const { sut } = makeSut();

    const validationError = new ValidationError<{ orphanageId: string[] }>([
      {
        orphanageId: ["Must be a 24-digit string that has only hex characters"],
      },
    ]);
    const invalidIds = [-1, null, undefined, "123", [], {}];

    for (const id of invalidIds) {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        sut.loadById(id);
      } catch (e) {
        expect(e).toEqual(validationError);
      }
    }
  });
  it("Should return an orphanage that matches provided id", async () => {
    const { sut, orphanageLoadByIdRepositorySpy } = makeSut();

    const orphanagesMocked = mockOrphanageModels(10);
    orphanageLoadByIdRepositorySpy.orphanagesMocked = orphanagesMocked;

    const orphanageTarget = orphanagesMocked[0];
    const id = orphanageTarget.id as string;

    const orphanage = await sut.loadById(id);

    expect(orphanage).toEqual(orphanageTarget);
  });
});
