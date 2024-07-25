import type { OrphanageLoadResult } from "@/domain/usecases";

import { MissingParamError } from "@/presentation/errors";
import { ok, serverError, badRequest, noContent } from "@/presentation/helpers";
import type { Controller, HttpResponse } from "@/presentation/protocols";

export class OrphanageLoadResultController implements Controller {
  constructor(private readonly orphanagesLoad: OrphanageLoadResult) {}

  async handle(
    request: OrphanageLoadResultController.Request
  ): Promise<HttpResponse> {
    try {
      const { orphanageId } = request;

      if (!orphanageId) {
        return badRequest(new MissingParamError("orphanageId"));
      }

      const orphanage = await this.orphanagesLoad.loadResult(orphanageId);

      return orphanage ? ok({ orphanage }) : noContent();
    } catch (e) {
      console.log(e);
      return serverError(e as Error);
    }
  }
}

export namespace OrphanageLoadResultController {
  export type Request = {
    orphanageId: string;
  };
}
