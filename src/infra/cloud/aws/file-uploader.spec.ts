import { faker } from "@faker-js/faker";

import { S3Client } from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";

import type { File } from "@/domain/models";

import { AWSFileUploader } from "@/infra/cloud";

const s3ConfigMocked = {
  bucketName: "mocked_bucket",
  defaultRegion: "mocked_en_US",
  defaultFilesACL: "mocked_public_read",
};

jest.mock("@/main/config/env", () => ({
  getEnv: () => ({
    bucketName: "mocked_bucket",
    defaultRegion: "mocked_en_US",
    defaultFilesACL: "mocked_public_read",
  }),
}));

const mockFile = (): File => ({
  size: 1,
  name: faker.lorem.word(15),
  content: Buffer.from("123"),
  type: "image/jpeg",
  extension: ".jpeg",
});

const makeSut = () => {
  const sut = new AWSFileUploader();
  const sutProto = Object.getPrototypeOf(sut);

  return {
    sut,
    sutProto,
  } as const;
};

describe("AWSFileUploader", () => {
  const s3Mock = mockClient(S3Client);

  afterAll(() => {
    s3Mock.restore();
  });

  it("Should create a S3Client instance upon creating instance of AWSFileUploader", async () => {
    const { sut } = makeSut();

    expect((sut as any).client).toBeInstanceOf(S3Client);
  });

  it("Should have property bucketName that comes from env variable 'bucketName'", async () => {
    const { sut } = makeSut();

    expect((sut as any).bucketName).toBe(s3ConfigMocked.bucketName);
  });

  describe("generateFileKey()", () => {
    it("Should have return a key that relies on file name, extension and a timestamp when generateFileKey", async () => {
      const { sut } = makeSut();

      const file = mockFile();
      const timestamp = Date.now();

      const key = (sut as any).generateFileKey(file, timestamp);

      expect(key).toContain(file.name);
      expect(key).toContain(file.extension);
      expect(key).toContain(timestamp + "");
      expect(key).toEqual(`${file.name}-${timestamp}${file.extension}`);
    });
  });

  describe("uploadFile()", () => {
    it("Should call generateFileKey", async () => {
      const { sut } = makeSut();

      const generateFileKeyStub = jest.fn();

      (sut as any).generateFileKey = generateFileKeyStub;

      await (sut as any).uploadFile(mockFile());

      expect(generateFileKeyStub).toHaveBeenCalled();

      s3Mock.reset();
    });

    it("Should send a PutObjectCommand to S3Client", async () => {
      const { sut } = makeSut();

      const file = mockFile();
      const timestamp = Date.now();

      const expectedKey = `${file.name}-${timestamp}${file.extension}`;

      await (sut as any).uploadFile(file);

      const putCommandCall = s3Mock.calls()[0].args[0].input;

      expect(putCommandCall).toEqual({
        Key: expectedKey,
        Body: file.content,
        ContentType: file.type,
        Bucket: s3ConfigMocked.bucketName,
        ACL: "mocked_public_read",
      });

      s3Mock.reset();
    });

    it("Should return s3 path of uploaded file", async () => {
      const { sut } = makeSut();

      const file = mockFile();

      const path = await (sut as any).uploadFile(file);

      expect(path).toContain(s3ConfigMocked.bucketName);
      expect(path).toContain(file.name);
      expect(path).toContain(file.extension);

      const timestamp = (path as string).split("-")[1].replace(".jpeg", "");

      expect(path).toBe(
        `${s3ConfigMocked.bucketName}/${file.name}-${timestamp}${file.extension}`
      );

      s3Mock.reset();
    });
  });

  describe("upload()", () => {
    it("Should return undefined when it throws", async () => {
      const { sut } = makeSut();

      const uploadFileStub = jest.fn().mockImplementationOnce(() => {
        throw new Error("Caused by test");
      });

      (sut as any).uploadFile = uploadFileStub;

      const files = [mockFile()];

      const result = await sut.upload(files);
      s3Mock.reset();

      expect(result).toBe(undefined);
    });

    it("Should call uploadFile for each provided file", async () => {
      const { sut } = makeSut();

      const uploadFileStub = jest.fn();

      (sut as any).uploadFile = uploadFileStub;

      const files = [
        mockFile(),
        mockFile(),
        mockFile(),
        mockFile(),
        mockFile(),
      ];

      await sut.upload(files);
      s3Mock.reset();

      expect(uploadFileStub).toHaveBeenCalledTimes(files.length);
    });

    it("Should return all paths of uploaded files", async () => {
      const { sut } = makeSut();

      const mockedPaths: string[] = [];

      const uploadFileStub = jest.fn().mockImplementation((file: File) => {
        const key = `${s3ConfigMocked.bucketName}/${file.name}.${file.type}`;
        mockedPaths.push(key);

        return key;
      });

      (sut as any).uploadFile = uploadFileStub;

      const files = [mockFile(), mockFile()];

      const result = await sut.upload(files);
      s3Mock.reset();

      expect(uploadFileStub).toHaveBeenCalledTimes(files.length);
      expect(result).toEqual(mockedPaths.map((path) => ({ path })));
    });
  });
});
