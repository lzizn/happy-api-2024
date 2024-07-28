import { File, FileUploaded } from "@/domain/models";

export interface FileUpload {
  upload: (files: File[]) => FileUpload.Result;
}

export namespace FileUpload {
  export type Result = Promise<FileUploaded[]>;
}
