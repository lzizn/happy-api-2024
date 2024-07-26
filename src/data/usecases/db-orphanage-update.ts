import type { OrphanageModel } from "@/domain/models";
import type { OrphanageUpdate } from "@/domain/usecases";
import type { OrphanageUpdateRepository } from "@/data/protocols";

export class DbOrphanageUpdate implements OrphanageUpdate {
  constructor(
    private readonly orphanagesUpdateRepository: OrphanageUpdateRepository
  ) {}

  update(orphanage: Partial<OrphanageModel>): Promise<OrphanageUpdate.Result> {
    return this.orphanagesUpdateRepository.update(orphanage);
  }
}
