import type { OrphanageModel } from "@/domain/models";

export interface OrphanageCreateRepository {
  create: (
    orphanage: Exclude<OrphanageModel, "id">
  ) => Promise<OrphanageCreateRepository.Result>;
}

export namespace OrphanageCreateRepository {
  export type Result = OrphanageModel;
}
