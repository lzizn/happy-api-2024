import type { OrphanageModel } from "@/domain/models";

export interface OrphanageUpdate {
  update: (
    orphanage: Partial<OrphanageModel>
  ) => Promise<OrphanageUpdate.Result>;
}

export namespace OrphanageUpdate {
  export type Result = OrphanageModel;
}
