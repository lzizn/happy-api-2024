import type { OrphanageLoadResult } from "@/domain/usecases";

import type { Controller, HttpResponse } from "@/presentation/protocols";
import { InvalidParamError, MissingParamError } from "@/presentation/errors";
import { ok, serverError, badRequest, noContent } from "@/presentation/helpers";

export class OrphanageLoadResultController implements Controller {
  constructor(private readonly orphanagesLoad: OrphanageLoadResult) {}

  async handle(
    request: OrphanageLoadResultController.Request
  ): Promise<HttpResponse> {
    try {
      const { orphanageId } = request;

      if ("undefined" === orphanageId + "") {
        return badRequest(new MissingParamError("orphanageId"));
      }

      if (typeof orphanageId !== "string") {
        return badRequest(new InvalidParamError("orphanageId"));
      }

      const orphanage = await this.orphanagesLoad.loadResult(orphanageId);

      return orphanage ? ok({ orphanage }) : noContent();
    } catch (e) {
      return serverError(e as Error);
    }
  }
}

export namespace OrphanageLoadResultController {
  export type Request = {
    orphanageId: string;
  };
}
