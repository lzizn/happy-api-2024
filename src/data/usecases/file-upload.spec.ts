import { faker } from "@faker-js/faker";

import { RemoteFileUpload } from "@/data/usecases";
import type { FileUploader } from "@/data/protocols/file";

import { mockFile } from "@/domain/mocks";
import type { File, FileUploaded } from "@/domain/models";

const makeFileUploaderSpy = () => {
  class FileUploaderSpy implements FileUploader {
    input?: File | File[];
    result?: FileUploaded[] = new Array(1).fill(null).map(() => ({
      path: faker.image.url(),
      url: faker.image.url(),
      name: faker.lorem.word(10),
    }));

    async upload(files: File[]): FileUploader.Result {
      this.input = files;

      return this.result;
    }
  }

  return new FileUploaderSpy();
};

const makeSut = () => {
  const fileUploaderSpy = makeFileUploaderSpy();
  const sut = new RemoteFileUpload(fileUploaderSpy);

  return {
    sut,
    fileUploaderSpy,
  } as const;
};

describe("RemoteFileUpload", () => {
  const fileMocked = mockFile();

  // ---- FileUploader
  it("Should call FileUploader with correct params", async () => {
    const { fileUploaderSpy, sut } = makeSut();

    await sut.upload([fileMocked]);

    expect(fileUploaderSpy.input).toEqual([fileMocked]);
  });
  it("Should throw if FileUploader throws", async () => {
    const { fileUploaderSpy, sut } = makeSut();

    const error = new Error("Caused by test");
    jest.spyOn(fileUploaderSpy, "upload").mockImplementationOnce(() => {
      throw error;
    });

    try {
      await sut.upload([fileMocked]);
    } catch (e) {
      expect(e).toEqual(error);
    }
  });
  it("Should throw FileUploaderError when FileUploader returns nil", async () => {
    const { fileUploaderSpy, sut } = makeSut();

    fileUploaderSpy.result = undefined as any;

    const promise = sut.upload([fileMocked]);

    await expect(promise).rejects.toThrow();
  });

  // ---- General
  it("Should return uploaded files from FileUploader when FilesUploader returns array", async () => {
    const { fileUploaderSpy, sut } = makeSut();

    const response = await sut.upload([fileMocked]);

    expect(response).toEqual(fileUploaderSpy.result);
  });
  it("Should turn response from FileUploader into array when FilesUploader returns a single object", async () => {
    const { fileUploaderSpy, sut } = makeSut();

    fileUploaderSpy.result = fileMocked as any;

    const response = await sut.upload([fileMocked]);

    expect(response).toEqual([fileUploaderSpy.result]);
  });
});
