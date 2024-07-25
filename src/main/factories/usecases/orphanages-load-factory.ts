import { OrphanageMongoRepository } from "@/infra/db";
import { DbOrphanagesLoad } from "@/data/usecases";
import type { OrphanagesLoad } from "@/domain/usecases";

export const makeDbOrphanagesLoad = (): OrphanagesLoad => {
  const orphanageMongoRepository = new OrphanageMongoRepository();
  return new DbOrphanagesLoad(orphanageMongoRepository);
};
