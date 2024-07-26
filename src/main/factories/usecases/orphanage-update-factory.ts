import { DbOrphanageUpdate } from "@/data/usecases";
import { OrphanageMongoRepository } from "@/infra/db";
import type { OrphanageUpdate } from "@/domain/usecases";

export const makeDbOrphanageUpdate = (): OrphanageUpdate => {
  const orphanageMongoRepository = new OrphanageMongoRepository();
  return new DbOrphanageUpdate(orphanageMongoRepository);
};
