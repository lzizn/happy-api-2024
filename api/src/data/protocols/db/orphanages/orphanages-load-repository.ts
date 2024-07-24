import { OrphanageModel } from "@/domain/models";

export interface OrphanagesLoadRepository {
  loadAll: () => Promise<OrphanagesLoadRepository.Result>;
}

export namespace OrphanagesLoadRepository {
  export type Result = OrphanageModel[];
}
