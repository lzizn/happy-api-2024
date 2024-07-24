import type { OrphanagesLoad } from "@/domain/usecases";

import { ok, serverError } from "@/presentation/helpers";
import type { Controller, HttpResponse } from "@/presentation/protocols";

export class OrphanagesLoadController implements Controller {
  constructor(private readonly orphanagesLoad: OrphanagesLoad) {}

  async handle(
    request: OrphanagesLoadController.Request
  ): Promise<HttpResponse> {
    try {
      const orphanages = await this.orphanagesLoad.load();

      return ok({ orphanages });
    } catch (e) {
      return serverError();
    }
  }
}

export namespace OrphanagesLoadController {
  export type Request = {};
}
