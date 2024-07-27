import type { OrphanageModel } from "@/domain/models";
import type { OrphanageCreate } from "@/domain/usecases";

import type {
  Controller,
  Validation,
  HttpResponse,
} from "@/presentation/protocols";
import { badRequest, created, serverError } from "@/presentation/helpers";

export class OrphanageCreateController implements Controller {
  constructor(
    private readonly orphanagesCreate: OrphanageCreate,
    private readonly validation: Validation
  ) {}

  async handle(
    request: OrphanagesCreateController.Request
  ): Promise<HttpResponse> {
    try {
      const { ...orphanage } = request;

      const error = this.validation.validate(orphanage);
      if (error) return badRequest(error);

      if ("_id" in orphanage) delete orphanage._id;
      if ("id" in orphanage) delete orphanage.id;

      const orphanageUpdated = await this.orphanagesCreate.create(
        orphanage as OrphanageModel
      );

      return created(orphanageUpdated);
    } catch (e) {
      return serverError(e as Error);
    }
  }
}

export namespace OrphanagesCreateController {
  export type Request = OrphanageModel | Partial<OrphanageModel>;
}
