import { RemoteFileDelete } from "@/data/usecases";
import type { FileDeleter } from "@/data/protocols/file";

const makeFileDeleterSpy = () => {
  class FileDeleterSpy implements FileDeleter {
    input?: string;
    result?: Error;
    error?: Error;

    async delete(fileKey: string): FileDeleter.Result {
      this.input = fileKey;

      return this.result;
    }
  }

  return new FileDeleterSpy();
};

const makeSut = () => {
  const fileDeleterSpy = makeFileDeleterSpy();
  const sut = new RemoteFileDelete(fileDeleterSpy);

  return {
    sut,
    fileDeleterSpy,
  } as const;
};

describe("RemoteFileDelete", () => {
  // ---- FileDeleter
  it("Should call FileDeleter with correct params", async () => {
    const { fileDeleterSpy, sut } = makeSut();

    await sut.delete("123");

    expect(fileDeleterSpy.input).toEqual("123");
  });
  it("Should throw if FileDeleter throws", async () => {
    const { fileDeleterSpy, sut } = makeSut();

    const error = new Error("caused by test");

    jest.spyOn(fileDeleterSpy, "delete").mockImplementationOnce(() => {
      throw error;
    });

    try {
      await sut.delete("123");
    } catch (e) {
      expect(e).toEqual(error);
    }
  });
  it("Should return error if FileDeleter returns error", async () => {
    const { sut, fileDeleterSpy } = makeSut();

    const error = new Error("caused by test");
    fileDeleterSpy.result = error;

    const response = await sut.delete("123");

    expect(response).toEqual(error);
  });

  // ---- General
  it("Should return undefined if file is deleted successfully", async () => {
    const { sut } = makeSut();

    const response = await sut.delete("123");

    expect(response).toEqual(undefined);
  });
});
