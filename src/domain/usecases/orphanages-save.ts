import { OrphanageModel } from "@/domain/models";

export interface OrphanagesSave {
  save: (orphanage: Partial<OrphanageModel>) => Promise<OrphanagesSave.Result>;
}

export namespace OrphanagesSave {
  export type Result = OrphanageModel | null;
}
