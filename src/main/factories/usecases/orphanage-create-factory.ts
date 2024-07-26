import { DbOrphanagesSave } from "@/data/usecases";
import { OrphanageMongoRepository } from "@/infra/db";
import type { OrphanagesSave } from "@/domain/usecases";

export const makeDbOrphanageCreate = (): OrphanagesSave => {
  const orphanageMongoRepository = new OrphanageMongoRepository();
  return new DbOrphanagesSave(orphanageMongoRepository);
};
