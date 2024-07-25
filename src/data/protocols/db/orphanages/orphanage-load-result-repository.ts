import { ObjectId } from "mongodb";
import { OrphanageModel } from "@/domain/models";

export interface OrphanageLoadResultRepository {
  loadResult: (
    orphanageId: string | ObjectId
  ) => Promise<OrphanageLoadResultRepository.Result>;
}

export namespace OrphanageLoadResultRepository {
  export type Result = OrphanageModel | null;
}
