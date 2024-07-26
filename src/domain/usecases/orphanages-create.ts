import { OrphanageModel } from "@/domain/models";

export interface OrphanageCreate {
  create: (
    orphanage: Exclude<OrphanageModel, "id">
  ) => Promise<OrphanageCreate.Result>;
}

export namespace OrphanageCreate {
  export type Result = OrphanageModel;
}
