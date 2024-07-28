import type { File } from "@/domain/models";
import type { FileUpload } from "@/domain/usecases";

import { created } from "@/presentation/helpers";
import type { Controller, HttpResponse } from "@/presentation/protocols";

export class FileUploadController implements Controller {
  constructor(private readonly fileUpload: FileUpload) {}

  async handle(request: FileUploadController.Request): Promise<HttpResponse> {
    const { files } = request;
    const filesPaths = await this.fileUpload.upload(files);

    return created(filesPaths);
  }
}

export namespace FileUploadController {
  export type Request = {
    files: File[];
  };
}
