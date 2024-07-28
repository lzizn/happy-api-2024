import { DbOrphanageCreate } from "@/data/usecases";
import type { OrphanageCreate } from "@/domain/usecases";

import { OrphanageMongoRepository } from "@/infra/db";
import { OrphanageCreateSchemaValidator } from "@/infra/validators";

export const makeDbOrphanageCreate = (): OrphanageCreate => {
  const orphanageMongoRepository = new OrphanageMongoRepository();

  const orphanageCreateSchemaValidator = new OrphanageCreateSchemaValidator();

  return new DbOrphanageCreate(
    orphanageMongoRepository,
    orphanageCreateSchemaValidator
  );
};
