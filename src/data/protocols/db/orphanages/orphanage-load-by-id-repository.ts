import { ObjectId } from "mongodb";
import { OrphanageModel } from "@/domain/models";

export interface OrphanageLoadByIdRepository {
  loadById: (
    orphanageId: string | ObjectId
  ) => Promise<OrphanageLoadByIdRepository.Result>;
}

export namespace OrphanageLoadByIdRepository {
  export type Result = OrphanageModel | null;
}
