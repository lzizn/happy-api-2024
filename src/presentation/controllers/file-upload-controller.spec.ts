import { mockFile } from "@/domain/mocks";
import type { File, FileUploaded } from "@/domain/models";
import type { FileUpload } from "@/domain/usecases";

import { InvalidParamError } from "@/presentation/errors";
import { badRequest, created } from "@/presentation/helpers";
import { FileUploadController } from "@/presentation/controllers";

const makeFileUploadSpy = () => {
  class FileUploadStub implements FileUpload {
    input?: File[];
    result?: FileUploaded[];
    error?: Error;

    async upload(files: File[]): FileUpload.Result {
      this.input = files;

      if (this.error) throw this.error;

      const result = files.map(({ name, content }) => ({
        name,
        url: "https://" + "mocked_bucket/" + name + content,
        path: "mocked_bucket/" + name + content,
      }));
      this.result = result;

      return result;
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
  it("Should return 400 and invalid param when files is not array", async () => {
    const { sut } = makeSut();

    const cases = [null, false, 0, -0, {}, "123"];

    for (const value of cases) {
      // @ts-expect-error
      const response = await sut.handle({ files: value });

      expect(response).toEqual(badRequest(new InvalidParamError("files")));
    }
  });

  it("Should return 201 and created image paths when valid data is provided", async () => {
    const { sut, fileUploadSpy } = makeSut();

    const files = [mockFile(), mockFile()];
    const response = await sut.handle({
      files,
    });

    expect(response).toEqual(created(fileUploadSpy.result));
  });
});
