import { mockOrphanageModels } from "@/domain/mocks";
import type { OrphanageModel } from "@/domain/models";
import type { OrphanageLoadById } from "@/domain/usecases";

import { noContent, ok } from "@/presentation/helpers";
import { ValidationError } from "@/presentation/errors";
import { OrphanageLoadByIdController } from "@/presentation/controllers";

const makeOrphanageLoadByIdSpy = () => {
  class OrphanageLoadByIdSpy implements OrphanageLoadById {
    orphanagesMocked: OrphanageModel[] = [];
    result?: OrphanageLoadById.Result;
    error?: Error;

    async loadById(id: string): Promise<OrphanageLoadById.Result> {
      if (this.error) throw this.error;

      const match = this.orphanagesMocked.find((x) => x.id === id);

      const result = match ?? null;
      this.result = result;
      return result;
    }
  }

  return new OrphanageLoadByIdSpy();
};

const makeSut = () => {
  const id = "11a1a11d11cb1a11111fb111";

  const orphanageLoadByIdSpy = makeOrphanageLoadByIdSpy();
  const sut = new OrphanageLoadByIdController(orphanageLoadByIdSpy);

  return {
    id,
    sut,
    orphanageLoadByIdSpy,
  } as const;
};

describe("OrphanageLoadByIdController", () => {
  // ---- OrphanageLoadById
  it("Should call OrphanageLoadById", async () => {
    const { sut, id, orphanageLoadByIdSpy } = makeSut();

    const orphanageLoadByIdSpySpy = jest.spyOn(
      orphanageLoadByIdSpy,
      "loadById"
    );

    await sut.handle({ orphanageId: id });
    expect(orphanageLoadByIdSpySpy).toHaveBeenCalled();
  });
  it("Should throw when OrphanageLoadById throws", async () => {
    const { sut, id, orphanageLoadByIdSpy } = makeSut();

    const error = new Error("Caused by test");

    orphanageLoadByIdSpy.error = error;

    try {
      await sut.handle({ orphanageId: id });
    } catch (e) {
      expect(e).toEqual(error);
    }
  });

  // ---- General
  it("Should throw when orphanageId is null", async () => {
    const { sut, orphanageLoadByIdSpy } = makeSut();

    const validationError = new ValidationError([
      {
        error: ["Caused by test"],
      },
    ]);

    orphanageLoadByIdSpy.error = validationError;

    try {
      // @ts-ignore
      await sut.handle({ orphanageId: null });
    } catch (e) {
      expect(e).toEqual(validationError);
    }
  });
  it("Should return result from OrphanageLoadById", async () => {
    const { sut, orphanageLoadByIdSpy } = makeSut();

    const orphanagesMocked = mockOrphanageModels(5);

    orphanageLoadByIdSpy.orphanagesMocked = orphanagesMocked;

    const httpResponse = await sut.handle({
      orphanageId: orphanagesMocked[0].id as string,
    });

    expect(httpResponse).toEqual(ok(orphanageLoadByIdSpy.result));
  });
  it("Should return 204 and null if response from OrphanageLoadById is null", async () => {
    const { sut, id, orphanageLoadByIdSpy } = makeSut();

    orphanageLoadByIdSpy.orphanagesMocked = [];

    const httpResponse = await sut.handle({ orphanageId: id });

    expect(httpResponse).toEqual(noContent());
  });
});
