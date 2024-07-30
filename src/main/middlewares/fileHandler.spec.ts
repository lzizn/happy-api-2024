import { faker } from "@faker-js/faker";

import { File } from "@/domain/models";
import { fileHandler } from "@/main/middlewares";

const mockMulterFile = () => {
  const bufferContent = Buffer.from("123");

  return {
    size: bufferContent.length,
    originalname: `${faker.lorem.word({ length: { min: 10, max: 20 } })}.jpeg`,
    mimetype: "image/jpeg",
    buffer: bufferContent,
  } as Express.Multer.File;
};

describe("fileHandler", () => {
  it("Should call next when req.files is not an array", () => {
    // prettier-ignore
    const cases = [null, undefined, 0, "123", {}, new Map()];

    const nextStub = jest.fn();

    cases.forEach((value) => {
      // @ts-expect-error
      fileHandler({ files: value }, {}, nextStub);
    });

    expect(nextStub).toHaveBeenCalledTimes(cases.length);
  });

  it("Should map multer files to FileModel and assign them to req.body", () => {
    const nextStub = jest.fn();

    const multerFiles: Express.Multer.File[] = [
      mockMulterFile(),
      mockMulterFile(),
      mockMulterFile(),
      mockMulterFile(),
      mockMulterFile(),
    ];
    const request = {
      body: {} as Record<string, any>,
      files: multerFiles,
    };

    // @ts-expect-error
    fileHandler(request, {}, nextStub);

    const toFile = (file: Express.Multer.File): File => {
      const lastDotIndex = file.originalname.lastIndexOf(".");

      const filename = file.originalname.slice(0, lastDotIndex);
      const fileExtension = file.originalname.slice(lastDotIndex);

      return {
        size: file.size,
        name: filename,
        type: file.mimetype,
        extension: fileExtension,
        content: file.buffer,
      };
    };

    expect(request.body.files).not.toEqual(multerFiles);
    expect(request.body.files.length).toBe(multerFiles.length);
    expect(request.body.files).toEqual([
      toFile(request.files[0]),
      toFile(request.files[1]),
      toFile(request.files[2]),
      toFile(request.files[3]),
      toFile(request.files[4]),
    ]);

    expect(nextStub).toHaveBeenCalled();
  });
});
