import { DbOrphanageUpdate } from "@/data/usecases";
import { OrphanageMongoRepository } from "@/infra/db";
import type { OrphanageUpdate } from "@/domain/usecases";
import { OrphanageUpdateSchemaValidator } from "@/infra/validators";

export const makeDbOrphanageUpdate = (): OrphanageUpdate => {
  const orphanageMongoRepository = new OrphanageMongoRepository();

  const orphanageUpdateSchemaValidator = new OrphanageUpdateSchemaValidator();

  return new DbOrphanageUpdate(
    orphanageMongoRepository,
    orphanageUpdateSchemaValidator
  );
};
