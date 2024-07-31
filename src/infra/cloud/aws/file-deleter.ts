import {
  S3Client,
  ObjectCannedACL,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import { getEnv } from "@/main/config/env";
import { FileDeleter } from "@/data/protocols/file";

const {
  bucketName,
  defaultRegion,
  awsAccessKey,
  defaultFilesACL,
  awsSecretAccessKey,
} = getEnv();

const s3Config = {
  bucketName,
  defaultRegion,
  defaultFilesACL: defaultFilesACL as ObjectCannedACL,
};

export class AWSFileDeleter implements FileDeleter {
  private client: S3Client;
  private readonly bucketName = s3Config.bucketName;

  constructor() {
    this.client = new S3Client({
      region: s3Config.defaultRegion,
      credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretAccessKey,
      },
    });
  }

  async delete(fileKey: string): FileDeleter.Result {
    try {
      const deleteObjectCommand = new DeleteObjectCommand({
        Bucket: s3Config.bucketName,
        Key: fileKey,
      });

      await this.client.send(deleteObjectCommand);
    } catch (e) {
      if (e instanceof Error) {
        return e;
      }

      return new Error("Unknown error");
    }
  }
}
