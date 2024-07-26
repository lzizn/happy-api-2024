import type { OrphanageModel } from "@/domain/models";

export interface OrphanagesSaveRepository {
  save: (
    orphanage: Partial<OrphanageModel>
  ) => Promise<OrphanagesSaveRepository.Result>;
}

export namespace OrphanagesSaveRepository {
  export type Result = OrphanageModel | null;
}
