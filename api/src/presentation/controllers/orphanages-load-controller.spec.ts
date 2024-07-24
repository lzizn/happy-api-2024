import type { OrphanagesLoad } from "@/domain/usecases";
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

    await sut.handle();
    expect(orphanagesLoadSpy).toHaveBeenCalled();
  });

  it("Should return 500 when OrphanagesLoad throws", async () => {
    const { sut, orphanagesLoad } = makeSut();

    jest.spyOn(orphanagesLoad, "load").mockImplementation(async () => {
      throw new Error("Caused by test");
    });

    const response = await sut.handle();
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

    const response = await sut.handle();

    expect(orphanagesLoadSpy).toHaveBeenCalled();
    expect(response.body).toStrictEqual({
      orphanages: mockedOrphanages,
    });
  });

  it("Should return 200 when there is at least one orphanage", async () => {
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

    jest
      .spyOn(orphanagesLoad, "load")
      .mockImplementation(async () => mockedOrphanages);

    const response = await sut.handle();

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("orphanages");
    expect(Array.isArray(response.body.orphanages)).toBe(true);
    expect(response.body.orphanages.length).toBe(1);
  });

  it("Should return 204 and null if response from OrphanagesLoad is empty", async () => {
    const { sut, orphanagesLoad } = makeSut();

    jest.spyOn(orphanagesLoad, "load").mockImplementation(async () => []);

    const httpResponse = await sut.handle();

    expect(httpResponse.statusCode).toBe(204);
    expect(httpResponse.body).toBe(null);
  });
});
