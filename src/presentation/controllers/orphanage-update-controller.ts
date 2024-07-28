import type { OrphanageModel } from "@/domain/models";
import type { OrphanageLoadById, OrphanageUpdate } from "@/domain/usecases";

import type {
  Controller,
  Validation,
  HttpResponse,
} from "@/presentation/protocols";
import { NotFoundError } from "@/presentation/errors";
import { ok, notFound, badRequest } from "@/presentation/helpers";

export class OrphanageUpdateController implements Controller {
  constructor(
    private readonly orphanagesLoadById: OrphanageLoadById,
    private readonly orphanagesUpdate: OrphanageUpdate,
    private readonly validation: Validation
  ) {}

  async handle(
    request: OrphanagesUpdateController.Request
  ): Promise<HttpResponse> {
    const error = this.validation.validate(request);
    if (error) return badRequest(error);

    const { orphanageId, ...orphanage } = request;

    const existingOrphanage = await this.orphanagesLoadById.loadById(
      orphanageId
    );

    if (existingOrphanage === null) {
      return notFound(new NotFoundError({ paramName: "orphanageId" }));
    }

    const orphanageUpdated = await this.orphanagesUpdate.update({
      ...orphanage,
      id: orphanageId,
    });

    return ok(orphanageUpdated);
  }
}

export namespace OrphanagesUpdateController {
  export type Request = Partial<OrphanageModel> & {
    orphanageId: string;
  };
}
