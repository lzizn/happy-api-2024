import { OrphanagesLoadController } from "@/presentation/controllers";

const makeSut = () => {
  const sut = new OrphanagesLoadController();

  return sut;
};

describe("Orphanages Load Controller", () => {
  it("Should return 200", async () => {
    const sut = makeSut();
    const result = await sut.handle({});
    expect(result.statusCode).toBe(200);
  });
});
