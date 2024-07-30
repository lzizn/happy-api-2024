import request from "supertest";

import { app } from "@/main/config/app";

import { S3Client } from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";

jest.mock("@/main/config/env", () => ({
  getEnv: () => ({
    bucketName: "mocked_bucket",
    defaultRegion: "mocked_en_US",
    defaultFilesACL: "mocked_public_read",
  }),
}));

describe("File Routes", () => {
  mockClient(S3Client);

  it("Should return 400 when providing attachments on wrong property name", async () => {
    const file = {
      content: Buffer.from("123"),
      name: "custom_file_name.txt",
    };

    const response = await request(app)
      .post("/api/orphanages/images")
      .attach("different_property", file.content, file.name);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: "LIMIT_UNEXPECTED_FILE",
      message: "Files must be attached to property 'files'",
    });
  });

  it("Should return 400 when providing attachments bigger than 3MB", async () => {
    // 3.1MB
    const buffer = Buffer.alloc(3.1 * 1024 * 1024);

    const file = {
      content: buffer,
      name: "custom_file_name.txt",
    };

    const response = await request(app)
      .post("/api/orphanages/images")
      .attach("files", file.content, file.name);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: "LIMIT_FILE_SIZE",
      message: "File is too big. Max file size is 3MB",
    });
  });

  it("Should return 400 when providing more than 2 attachments", async () => {
    const file = {
      content: Buffer.from("123"),
      name: "custom_file_name.txt",
    };

    const response = await request(app)
      .post("/api/orphanages/images")
      .attach("files", file.content, file.name)
      .attach("files", file.content, file.name)
      .attach("files", file.content, file.name);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: "LIMIT_UNEXPECTED_FILE",
      // this is a well known bug in multer and has never been fixed
      message: "Files must be attached to property 'files'",
    });
  });

  it("Should return 201 and paths to uploaded files when body is valid", async () => {
    const files = [
      {
        content: Buffer.from("123"),
        name: "custom_file_name.txt",
      },
      {
        content: Buffer.from("456"),
        name: "another_file.txt",
      },
    ];

    const response = await request(app)
      .post("/api/orphanages/images")
      .attach("files", files[0].content, files[0].name)
      .attach("files", files[1].content, files[1].name);

    expect(response.statusCode).toBe(201);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(files.length);
    expect(response.body[0].path).toContain(files[0].name.replace(".txt", ""));
    expect(response.body[1].path).toContain(files[1].name.replace(".txt", ""));
  });

  it("Should upload files up to 3MB", async () => {
    // 2.99
    const buffer = Buffer.alloc(2.99 * 1024 * 1024);

    const file = {
      content: buffer,
      name: "custom_file_name.txt",
    };

    const response = await request(app)
      .post("/api/orphanages/images")
      .attach("files", file.content, file.name);

    expect(response.statusCode).toBe(201);
  });
});
