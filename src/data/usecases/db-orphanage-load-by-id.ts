import { OrphanageLoadById } from "@/domain/usecases";
import { OrphanageLoadByIdRepository } from "@/data/protocols";

export class DbOrphanageLoadById implements OrphanageLoadById {
  constructor(
    private readonly orphanageLoadByIdRepository: OrphanageLoadByIdRepository
  ) {}

  loadById(orphanageId: string): Promise<OrphanageLoadById.Result> {
    return this.orphanageLoadByIdRepository.loadById(orphanageId);
  }
}
