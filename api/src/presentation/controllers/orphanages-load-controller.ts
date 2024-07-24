import { ok } from "@/presentation/helpers";
import type { Controller, HttpResponse } from "@/presentation/protocols";

export class OrphanagesLoadController implements Controller {
  async handle(
    request: OrphanagesLoadController.Request
  ): Promise<HttpResponse> {
    return ok({});
  }
}

export namespace OrphanagesLoadController {
  export type Request = {};
}
