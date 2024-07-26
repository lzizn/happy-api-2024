import { OrphanageModel } from "@/domain/models";

export interface OrphanageLoadById {
  loadById: (orphanageId: string) => Promise<OrphanageLoadById.Result>;
}

export namespace OrphanageLoadById {
  export type Result = OrphanageModel | null;
}
