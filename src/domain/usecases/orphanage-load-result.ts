import { OrphanageModel } from "@/domain/models";

export interface OrphanageLoadResult {
  loadResult: (orphanageId: string) => Promise<OrphanageLoadResult.Result>;
}

export namespace OrphanageLoadResult {
  export type Result = OrphanageModel | null;
}
