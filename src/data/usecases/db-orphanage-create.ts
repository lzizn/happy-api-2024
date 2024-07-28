import type { OrphanageModel } from "@/domain/models";
import type { OrphanageCreate } from "@/domain/usecases";

import type {
  SchemaValidator,
  OrphanageCreateRepository,
} from "@/data/protocols/db";

export class DbOrphanageCreate implements OrphanageCreate {
  constructor(
    private readonly orphanageCreateRepository: OrphanageCreateRepository,
    private readonly orphanageCreateSchemaValidator: SchemaValidator<OrphanageModel>
  ) {}

  create(
    orphanage: Exclude<OrphanageModel, "id">
  ): Promise<OrphanageCreate.Result> {
    const error = this.orphanageCreateSchemaValidator.validate(orphanage);

    if (error) throw error;

    return this.orphanageCreateRepository.create(orphanage);
  }
}
