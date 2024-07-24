import { OrphanagesLoad } from "@/domain/usecases";
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

describe("Orphanages Load Controller", () => {
  it("Should call orphanagesLoad", async () => {
    const { sut, orphanagesLoad } = makeSut();

    const orphanagesLoadSpy = jest.spyOn(orphanagesLoad, "load");

    await sut.handle({});
    expect(orphanagesLoadSpy).toHaveBeenCalled();
  });

  it("Should return 200", async () => {
    const { sut } = makeSut();
    const result = await sut.handle({});
    expect(result.statusCode).toBe(200);
  });
});
