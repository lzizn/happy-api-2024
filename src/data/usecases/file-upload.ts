import type { File } from "@/domain/models";
import { FileUploadError } from "@/domain/errors";
import type { FileUpload } from "@/domain/usecases";

import type { FileUploader } from "@/data/protocols/file";

export class RemoteFileUpload implements FileUpload {
  constructor(private readonly fileUploader: FileUploader) {}

  async upload(files: File[]): FileUpload.Result {
    const filesUploaded = await this.fileUploader.upload(files);

    if (filesUploaded == null) {
      throw new FileUploadError();
    }

    return Array.isArray(filesUploaded) ? filesUploaded : [filesUploaded];
  }
}
