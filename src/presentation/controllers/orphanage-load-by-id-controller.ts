import type { OrphanageLoadById } from "@/domain/usecases";

import { ok, noContent } from "@/presentation/helpers";
import type { Controller, HttpResponse } from "@/presentation/protocols";

export class OrphanageLoadByIdController implements Controller {
  constructor(private readonly orphanagesLoad: OrphanageLoadById) {}

  async handle(
    request: OrphanageLoadByIdController.Request
  ): Promise<HttpResponse> {
    const { orphanageId } = request;

    const orphanage = await this.orphanagesLoad.loadById(orphanageId);

    return orphanage ? ok(orphanage) : noContent();
  }
}

export namespace OrphanageLoadByIdController {
  export type Request = {
    orphanageId: string;
  };
}
