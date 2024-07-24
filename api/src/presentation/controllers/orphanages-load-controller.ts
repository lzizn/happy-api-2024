import { Controller, HttpResponse } from "@/presentation/protocols";

export class OrphanagesLoadController implements Controller {
  async handle(
    request: OrphanagesLoadController.Request
  ): Promise<HttpResponse> {
    return { statusCode: 200, body: {} };
  }
}

export namespace OrphanagesLoadController {
  export type Request = {};
}
