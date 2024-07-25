import { OrphanageLoadResult } from "@/domain/usecases";
import { OrphanageLoadResultRepository } from "@/data/protocols";

export class DbOrphanageLoadResult implements OrphanageLoadResult {
  constructor(
    private readonly orphanagesLoadResultRepository: OrphanageLoadResultRepository
  ) {}

  loadResult(orphanageId: string): Promise<OrphanageLoadResult.Result> {
    return this.orphanagesLoadResultRepository.loadResult(orphanageId);
  }
}
