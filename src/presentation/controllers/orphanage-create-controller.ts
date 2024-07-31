import type { File, OrphanageModel } from "@/domain/models";
import type { FileUpload, OrphanageCreate } from "@/domain/usecases";

import type {
  Controller,
  Validation,
  HttpResponse,
} from "@/presentation/protocols";
import { badRequest, created } from "@/presentation/helpers";

export class OrphanageCreateController implements Controller {
  constructor(
    private readonly fileUpload: FileUpload,
    private readonly orphanagesCreate: OrphanageCreate,
    private readonly validation: Validation
  ) {}

  async handle(
    orphanage: OrphanagesCreateController.Request
  ): Promise<HttpResponse> {
    const error = this.validation.validate(orphanage);
    if (error) return badRequest(error);

    if (orphanage.files) {
      const images = await this.fileUpload.upload(orphanage.files);
      delete orphanage.files;
      Object.assign(orphanage, { images });
    }

    if (typeof orphanage.latitude === "string") {
      orphanage.latitude = Number(orphanage.latitude);
    }
    if (typeof orphanage.longitude === "string") {
      orphanage.longitude = Number(orphanage.longitude);
    }

    orphanage.open_on_weekends = ["true", "1"].includes(
      orphanage.open_on_weekends + ""
    );

    if ("id" in orphanage) delete orphanage.id;

    const orphanageNew = await this.orphanagesCreate.create(
      orphanage as OrphanageModel
    );

    return created(orphanageNew);
  }
}

export namespace OrphanagesCreateController {
  export type Request = Partial<OrphanageModel> & {
    files?: File[];
  };
}
