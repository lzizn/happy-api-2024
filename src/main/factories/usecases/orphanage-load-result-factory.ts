import { OrphanageMongoRepository } from "@/infra/db";
import { DbOrphanageLoadResult } from "@/data/usecases";
import type { OrphanageLoadResult } from "@/domain/usecases";

export const makeDbOrphanageLoadResult = (): OrphanageLoadResult => {
  const orphanageMongoRepository = new OrphanageMongoRepository();
  return new DbOrphanageLoadResult(orphanageMongoRepository);
};
