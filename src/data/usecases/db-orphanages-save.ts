import type { OrphanageModel } from "@/domain/models";
import type { OrphanagesSave } from "@/domain/usecases";
import type { OrphanagesSaveRepository } from "@/data/protocols";

export class DbOrphanagesSave implements OrphanagesSave {
  constructor(
    private readonly orphanagesSaveRepository: OrphanagesSaveRepository
  ) {}

  save(
    orphanage: Exclude<OrphanageModel, "id" | "_id">
  ): Promise<OrphanagesSave.Result> {
    return this.orphanagesSaveRepository.save(orphanage);
  }
}
