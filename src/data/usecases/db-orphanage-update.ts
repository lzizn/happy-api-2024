import type { OrphanageModel } from "@/domain/models";
import type { OrphanageUpdate } from "@/domain/usecases";

import type {
  SchemaValidator,
  OrphanageUpdateRepository,
} from "@/data/protocols";

export class DbOrphanageUpdate implements OrphanageUpdate {
  constructor(
    private readonly orphanagesUpdateRepository: OrphanageUpdateRepository,
    private readonly orphanageUpdateSchemaValidator: SchemaValidator<OrphanageModel>
  ) {}

  update(orphanage: Partial<OrphanageModel>): Promise<OrphanageUpdate.Result> {
    const error = this.orphanageUpdateSchemaValidator.validate(orphanage);

    if (error) throw error;

    return this.orphanagesUpdateRepository.update(orphanage);
  }
}
