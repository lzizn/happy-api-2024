import { OrphanagesLoad } from "@/domain/usecases";
import { OrphanagesLoadRepository } from "@/data/protocols/db";

export class DbOrphanagesLoad implements OrphanagesLoad {
  constructor(
    private readonly orphanagesLoadRepository: OrphanagesLoadRepository
  ) {}

  load(): Promise<OrphanagesLoad.Result> {
    return this.orphanagesLoadRepository.loadAll();
  }
}
