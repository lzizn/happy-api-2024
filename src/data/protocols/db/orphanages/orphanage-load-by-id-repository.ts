import { OrphanageModel } from "@/domain/models";

export interface OrphanageLoadByIdRepository {
  loadById: (
    orphanageId: string
  ) => Promise<OrphanageLoadByIdRepository.Result>;
}

export namespace OrphanageLoadByIdRepository {
  export type Result = OrphanageModel | null;
}
