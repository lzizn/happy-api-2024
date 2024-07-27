import type { OrphanageLoadById } from "@/domain/usecases";

import type { Controller, HttpResponse } from "@/presentation/protocols";
import { InvalidParamError, MissingParamError } from "@/presentation/errors";
import { ok, serverError, badRequest, noContent } from "@/presentation/helpers";

export class OrphanageLoadByIdController implements Controller {
  constructor(private readonly orphanagesLoad: OrphanageLoadById) {}

  async handle(
    request: OrphanageLoadByIdController.Request
  ): Promise<HttpResponse> {
    try {
      const { orphanageId } = request;

      if ("undefined" === orphanageId + "") {
        return badRequest(new MissingParamError("orphanageId"));
      }

      if (typeof orphanageId !== "string" || orphanageId.length !== 24) {
        return badRequest(new InvalidParamError("orphanageId"));
      }

      const orphanage = await this.orphanagesLoad.loadById(orphanageId);

      return orphanage ? ok(orphanage) : noContent();
    } catch (e) {
      return serverError(e as Error);
    }
  }
}

export namespace OrphanageLoadByIdController {
  export type Request = {
    orphanageId: string;
  };
}
