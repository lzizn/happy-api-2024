import { OrphanagesLoad } from "@/domain/usecases";
import { ServerError } from "@/presentation/errors";
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
  it("Should call OrphanagesLoad", async () => {
    const { sut, orphanagesLoad } = makeSut();

    const orphanagesLoadSpy = jest.spyOn(orphanagesLoad, "load");

    await sut.handle({});
    expect(orphanagesLoadSpy).toHaveBeenCalled();
  });

  it("Should return 500 when OrphanagesLoad throws", async () => {
    const { sut, orphanagesLoad } = makeSut();

    jest.spyOn(orphanagesLoad, "load").mockImplementation(async () => {
      throw new Error("Caused by test");
    });

    const response = await sut.handle({});
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });

  it("Should return results from OrphanagesLoad", async () => {
    const { sut, orphanagesLoad } = makeSut();

    const mockedOrphanages = [
      {
        id: "1",
        description: "aa",
        name: "Maria's Heart",
        open_on_weekends: true,
        opening_hours: "Mon-Sun 7am-7pm",
        latitude: -20,
        longitude: -40,
        instructions: "None",
      },
    ];

    const orphanagesLoadSpy = jest.spyOn(orphanagesLoad, "load");
    orphanagesLoadSpy.mockImplementation(async () => mockedOrphanages);

    const response = await sut.handle({});

    expect(response.statusCode).toBe(200);
    expect(orphanagesLoadSpy).toHaveBeenCalled();
    expect(response.body).toStrictEqual({
      orphanages: mockedOrphanages,
    });
  });

  it("Should return 200", async () => {
    const { sut } = makeSut();
    const result = await sut.handle({});
    expect(result.statusCode).toBe(200);
  });
});
