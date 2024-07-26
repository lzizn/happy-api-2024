import type { OrphanageModel } from "@/domain/models";
import type { OrphanageCreate } from "@/domain/usecases";
import type { OrphanageCreateRepository } from "@/data/protocols";

export class DbOrphanageCreate implements OrphanageCreate {
  constructor(
    private readonly orphanagesSaveRepository: OrphanageCreateRepository
  ) {}

  create(
    orphanage: Exclude<OrphanageModel, "id">
  ): Promise<OrphanageCreate.Result> {
    return this.orphanagesSaveRepository.create(orphanage);
  }
}