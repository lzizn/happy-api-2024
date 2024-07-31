import type {
  FileDelete,
  OrphanageUpdate,
  OrphanageLoadById,
} from "@/domain/usecases";

import type {
  Controller,
  Validation,
  HttpResponse,
} from "@/presentation/protocols";
import { NotFoundError } from "@/presentation/errors";
import { ok, notFound, badRequest, noContent } from "@/presentation/helpers";

export class OrphanageDeleteImageController implements Controller {
  constructor(
    private readonly fileDeleter: FileDelete,
    private readonly orphanageUpdate: OrphanageUpdate,
    private readonly orphanagesLoadById: OrphanageLoadById,
    private readonly validation: Validation
  ) {}

  async handle(
    request: OrphanagesDeleteImageController.Request
  ): Promise<HttpResponse> {
    const error = this.validation.validate(request);
    if (error) return badRequest(error);

    const { orphanageId, imageKey } = request;

    const existingOrphanage = await this.orphanagesLoadById.loadById(
      orphanageId
    );

    if (existingOrphanage === null) {
      return notFound(new NotFoundError("orphanageId"));
    }

    if (!existingOrphanage.images || !existingOrphanage.images.length) {
      return noContent();
    }

    const fileExists = existingOrphanage.images.some(
      ({ path }) => path === imageKey
    );

    if (!fileExists) {
      return noContent();
    }

    const deleteError = await this.fileDeleter.delete(imageKey);

    if (deleteError) {
      throw deleteError;
    }

    const newImages = existingOrphanage.images.filter(
      (x) => x.path !== imageKey
    );

    const orphanageNew = await this.orphanageUpdate.update({
      id: existingOrphanage.id,
      images: newImages,
    });

    return ok({
      ...existingOrphanage,
      ...orphanageNew,
    });
  }
}

export namespace OrphanagesDeleteImageController {
  export type Request = {
    orphanageId: string;
    imageKey: string;
  };
}
