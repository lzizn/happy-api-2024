import type { OrphanageModel } from "@/domain/models";

export interface OrphanageUpdateRepository {
  update: (
    orphanage: Partial<OrphanageModel>
  ) => Promise<OrphanageUpdateRepository.Result>;
}

export namespace OrphanageUpdateRepository {
  export type Result = OrphanageModel;
}
