import type { OrphanageModel } from "@/domain/models";
import type { OrphanageLoadById, OrphanageUpdate } from "@/domain/usecases";

import { NotFoundError } from "@/presentation/errors";
import { ok, notFound, serverError, badRequest } from "@/presentation/helpers";
import type {
  Controller,
  Validation,
  HttpResponse,
} from "@/presentation/protocols";

export class OrphanageUpdateController implements Controller {
  constructor(
    private readonly orphanagesLoadById: OrphanageLoadById,
    private readonly orphanagesUpdate: OrphanageUpdate,
    private readonly validation: Validation
  ) {}

  async handle(
    request: OrphanagesUpdateController.Request
  ): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) return badRequest(error);

      const { orphanage, orphanageId } = request;

      const existingOrphanage = await this.orphanagesLoadById.loadById(
        orphanageId
      );

      if (existingOrphanage === null) {
        return notFound(new NotFoundError({ paramName: "orphanageId" }));
      }

      if ("_id" in orphanage) delete orphanage._id;

      const orphanageUpdated = await this.orphanagesUpdate.update({
        ...orphanage,
        id: orphanageId,
      });

      return ok({ orphanage: orphanageUpdated });
    } catch (e) {
      console.log(e);
      return serverError(e as Error);
    }
  }
}

export namespace OrphanagesUpdateController {
  export type Request = {
    orphanageId: string;
    orphanage: Partial<OrphanageModel>;
  };
}
