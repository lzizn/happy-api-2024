import type { OrphanageModel } from "@/domain/models";
import type { OrphanageCreate } from "@/domain/usecases";

import type {
  Controller,
  Validation,
  HttpResponse,
} from "@/presentation/protocols";
import { badRequest, created } from "@/presentation/helpers";

export class OrphanageCreateController implements Controller {
  constructor(
    private readonly orphanagesCreate: OrphanageCreate,
    private readonly validation: Validation
  ) {}

  async handle(
    orphanage: OrphanagesCreateController.Request
  ): Promise<HttpResponse> {
    const error = this.validation.validate(orphanage);
    if (error) return badRequest(error);

    if ("id" in orphanage) delete orphanage.id;

    const orphanageUpdated = await this.orphanagesCreate.create(
      orphanage as OrphanageModel
    );

    return created(orphanageUpdated);
  }
}

export namespace OrphanagesCreateController {
  export type Request = OrphanageModel | Partial<OrphanageModel>;
}
