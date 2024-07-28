import { faker } from "@faker-js/faker";

import { RemoteFileUpload } from "@/data/usecases";
import { FileUploader } from "@/data/protocols/file";

import { FileUploadError } from "@/domain/errors";
import { File, FileUploaded } from "@/domain/models";

const mockFile = (): File => ({
  size: 1,
  name: faker.lorem.words(4),
  content: new ArrayBuffer(1),
  type: faker.image.dataUri(),
  extension: "image/jpeg",
});

const makeFileUploaderSpy = () => {
  class FileUploaderSpy implements FileUploader {
    input?: File | File[];
    result?: FileUploaded[];

    async upload(files: File[]): FileUploader.Result {
      this.input = files;

      if (this.result) return this.result;

      const result = new Array(files.length).fill(null).map(() => ({
        path: faker.image.url(),
      }));

      this.result = result;
      return result;
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

    const falsy_values = [undefined, null];

    for (const value of falsy_values) {
      fileUploaderSpy.result = value as any;

      try {
        await sut.upload([fileMocked]);
      } catch (e) {
        expect(e).toBeInstanceOf(FileUploadError);
        expect((e as FileUploadError).name).toBe("FileUploadError");
        expect((e as FileUploadError).message).toBe(
          "Error while uploading file(s)"
        );
      }
    }
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
