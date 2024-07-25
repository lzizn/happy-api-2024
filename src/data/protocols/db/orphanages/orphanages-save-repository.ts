import type { OrphanageModel } from "@/domain/models";

export interface OrphanagesSaveRepository {
  save: (
    orphanage: Exclude<OrphanageModel, "id" | "_id">
  ) => Promise<OrphanagesSaveRepository.Result>;
}

export namespace OrphanagesSaveRepository {
  export type Result = OrphanageModel;
}
