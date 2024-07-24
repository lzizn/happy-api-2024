import { OrphanageModel } from "@/domain/models";

export interface OrphanagesLoad {
  load: () => Promise<OrphanagesLoad.Result>;
}

export namespace OrphanagesLoad {
  export type Result = OrphanageModel[];
}
