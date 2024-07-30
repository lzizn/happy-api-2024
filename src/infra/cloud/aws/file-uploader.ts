import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";

import { getEnv } from "@/main/config/env";

import type { File } from "@/domain/models";
import type { FileUploader } from "@/data/protocols/file";

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

export class AWSFileUploader implements FileUploader {
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

  private generateFileKey(file: File, timestamp: number): string {
    return `${file.name}-${timestamp}${file.extension}`;
  }

  private async uploadFile(file: File): Promise<string> {
    const timestamp = Date.now();

    const fileKey = this.generateFileKey(file, timestamp);

    const putObjectCommand = new PutObjectCommand({
      Key: fileKey,
      Body: file.content,
      ContentType: file.type,
      Bucket: this.bucketName,
      ACL: s3Config.defaultFilesACL,
    });

    await this.client.send(putObjectCommand);

    return `${this.bucketName}/${fileKey}`;
  }

  async upload(files: File[]): FileUploader.Result {
    try {
      const paths = await Promise.all(
        files.map(async (file) => this.uploadFile(file))
      );

      return paths.map((path) => ({ path }));
    } catch {
      return undefined;
    }
  }
}
