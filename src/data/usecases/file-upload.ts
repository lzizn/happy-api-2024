import { FileUploadError } from "@/domain/errors";
import type { FileUpload } from "@/domain/usecases";
import type { File, FileUploaded } from "@/domain/models";

import type { FileUploader } from "@/data/protocols/file";

export class RemoteFileUpload implements FileUpload {
  constructor(private readonly fileUploader: FileUploader) {}

  async upload(files: File[]): Promise<FileUploaded[]> {
    const filesUploaded = await this.fileUploader.upload(files);

    if (!filesUploaded) {
      throw new FileUploadError();
    }

    return Array.isArray(filesUploaded) ? filesUploaded : [filesUploaded];
  }
}
