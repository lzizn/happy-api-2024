import { File, FileUploaded } from "@/domain/models";

export interface FileUploader {
  upload: (files: File[]) => FileUploader.Result;
}

export namespace FileUploader {
  export type Result = Promise<FileUploaded[] | undefined>;
}
