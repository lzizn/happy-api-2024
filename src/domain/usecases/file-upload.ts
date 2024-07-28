import { File, FileUploaded } from "@/domain/models";

export interface FileUpload {
  upload: (files: File[]) => Promise<FileUploaded[]>;
}
