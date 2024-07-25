import { OrphanageModel } from "@/domain/models";

export interface OrphanagesSave {
  save: (
    orphanage: Exclude<OrphanageModel, "id" | "_id">
  ) => Promise<OrphanagesSave.Result>;
}

export namespace OrphanagesSave {
  export type Result = OrphanageModel;
}
