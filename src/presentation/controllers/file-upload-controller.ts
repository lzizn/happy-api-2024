import type { File } from "@/domain/models";
import type { FileUpload } from "@/domain/usecases";

import { InvalidParamError } from "@/presentation/errors";
import { badRequest, created } from "@/presentation/helpers";
import type { Controller, HttpResponse } from "@/presentation/protocols";

export class FileUploadController implements Controller {
  constructor(private readonly fileUpload: FileUpload) {}

  async handle(request: FileUploadController.Request): Promise<HttpResponse> {
    const { files } = request;

    if (!Array.isArray(files)) {
      return badRequest(new InvalidParamError("files"));
    }

    const filesPaths = await this.fileUpload.upload(files);

    return created(filesPaths);
  }
}

export namespace FileUploadController {
  export type Request = {
    files: File[];
  };
}
