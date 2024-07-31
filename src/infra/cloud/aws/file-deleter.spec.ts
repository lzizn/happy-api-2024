import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";

import { AWSFileDeleter } from "@/infra/cloud";

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

const makeSut = () => {
  const sut = new AWSFileDeleter();
  const sutProto = Object.getPrototypeOf(sut);

  return {
    sut,
    sutProto,
  } as const;
};

describe("AWSFileDeleter", () => {
  const s3Mock = mockClient(S3Client);

  afterAll(() => {
    s3Mock.restore();
  });

  it("Should create a S3Client instance upon creating instance of AWSFileDeleter", async () => {
    const { sut } = makeSut();

    expect((sut as any).client).toBeInstanceOf(S3Client);
  });

  it("Should have property bucketName that comes from env variable 'bucketName'", async () => {
    const { sut } = makeSut();

    expect((sut as any).bucketName).toBe(s3ConfigMocked.bucketName);
  });

  describe("remove()", () => {
    it("Should return error  when it throws", async () => {
      const { sut } = makeSut();

      mockClient(S3Client).on(DeleteObjectCommand).rejects("mocked rejection");

      const result = await sut.delete("mocked_bucket/123.jpeg");

      s3Mock.reset();
      expect(result).toBeInstanceOf(Error);
      // @ts-expect-error
      expect(result.message).toBe("mocked rejection");
    });

    it("Should call S3 with correct params", async () => {
      const { sut } = makeSut();

      const fileKey = s3ConfigMocked.bucketName + "/" + "123.jpeg";
      await sut.delete(fileKey);

      expect(s3Mock.calls()[0].args[0].input).toEqual({
        Bucket: s3ConfigMocked.bucketName,
        Key: fileKey,
      });

      s3Mock.reset();
    });

    it("Should return undefined when it removes successfully", async () => {
      const { sut } = makeSut();

      const fileKey = s3ConfigMocked.bucketName + "/" + "123.jpeg";
      const result = await sut.delete(fileKey);

      expect(result).toBe(undefined);

      s3Mock.reset();
    });
  });
});
