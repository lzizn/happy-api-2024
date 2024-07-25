import { OrphanageModel } from "@/domain/models";

export interface OrphanageLoadResultRepository {
  loadResult: (
    orphanageId: string
  ) => Promise<OrphanageLoadResultRepository.Result>;
}

export namespace OrphanageLoadResultRepository {
  export type Result = OrphanageModel | null;
}
