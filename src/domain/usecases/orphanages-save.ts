import { OrphanageModel } from "@/domain/models";

export interface OrphanagesSave {
  save: (
    orphanage: OrphanageModel | Partial<OrphanageModel>
  ) => Promise<OrphanagesSave.Result>;
}

export namespace OrphanagesSave {
  export type Result = OrphanageModel;
}
