import { faker } from "@faker-js/faker";

import type { File } from "@/domain/models";
import type { FileUpload } from "@/domain/usecases";

import { created } from "@/presentation/helpers";
import { FileUploadController } from "@/presentation/controllers";

const mockFile = (): File => ({
  size: 1,
  name: faker.lorem.words(4),
  content: Buffer.from("123"),
  type: faker.image.dataUri(),
  extension: "image/jpeg",
});

const makeFileUploadSpy = () => {
  class FileUploadStub implements FileUpload {
    input?: File[];
    error?: Error;

    async upload(files: File[]): FileUpload.Result {
      this.input = files;

      if (this.error) throw this.error;

      return files.map(() => ({ path: "/mocked-path" }));
    }
  }

  return new FileUploadStub();
};

const makeSut = () => {
  const fileUploadSpy = makeFileUploadSpy();
  const sut = new FileUploadController(fileUploadSpy);

  return {
    sut,
    fileUploadSpy,
  } as const;
};

describe("FileUploadController", () => {
  // ---- FileUpload
  it("Should call FileUpload with correct value", async () => {
    const { sut, fileUploadSpy } = makeSut();

    const file = mockFile();

    const request = {
      files: [file],
    };

    await sut.handle(request);

    expect(fileUploadSpy.input).toEqual(request.files);
  });
  it("Should throw if FileUpload throws", async () => {
    const { sut, fileUploadSpy } = makeSut();

    const file = mockFile();

    const error = new Error("Caused by test");
    fileUploadSpy.error = error;

    try {
      await sut.handle({ files: [file] });
    } catch (e) {
      expect(e).toEqual(error);
    }
  });

  // ---- General
  it("Should return 201 and created image paths when valid data is provided", async () => {
    const { sut } = makeSut();

    const response = await sut.handle({
      files: [mockFile(), mockFile()],
    });

    expect(response).toEqual(
      created([{ path: "/mocked-path" }, { path: "/mocked-path" }])
    );
  });
});
