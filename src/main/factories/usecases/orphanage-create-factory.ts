import { DbOrphanageCreate } from "@/data/usecases";
import { OrphanageMongoRepository } from "@/infra/db";
import type { OrphanageCreate } from "@/domain/usecases";

export const makeDbOrphanageCreate = (): OrphanageCreate => {
  const orphanageMongoRepository = new OrphanageMongoRepository();
  return new DbOrphanageCreate(orphanageMongoRepository);
};
