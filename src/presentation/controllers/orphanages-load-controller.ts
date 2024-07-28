import type { OrphanagesLoad } from "@/domain/usecases";

import { ok, noContent } from "@/presentation/helpers";
import type { Controller, HttpResponse } from "@/presentation/protocols";

export class OrphanagesLoadController implements Controller {
  constructor(private readonly orphanagesLoad: OrphanagesLoad) {}

  async handle(): Promise<HttpResponse> {
    const orphanages = await this.orphanagesLoad.load();

    return orphanages.length ? ok(orphanages) : noContent();
  }
}

export namespace OrphanagesLoadController {}
