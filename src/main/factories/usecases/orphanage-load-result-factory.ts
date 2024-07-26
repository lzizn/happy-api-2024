import { OrphanageMongoRepository } from "@/infra/db";
import { DbOrphanageLoadById } from "@/data/usecases";
import type { OrphanageLoadById } from "@/domain/usecases";

export const makeDbOrphanageLoadById = (): OrphanageLoadById => {
  const orphanageMongoRepository = new OrphanageMongoRepository();
  return new DbOrphanageLoadById(orphanageMongoRepository);
};
