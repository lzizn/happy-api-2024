import type { OrphanageLoadById } from "@/domain/usecases";

import type { OrphanageLoadByIdRepository } from "@/data/protocols/db";

import { ValidationError } from "@/presentation/errors";

export class DbOrphanageLoadById implements OrphanageLoadById {
  constructor(
    private readonly orphanageLoadByIdRepository: OrphanageLoadByIdRepository
  ) {}

  loadById(orphanageId: string): Promise<OrphanageLoadById.Result> {
    const idHasInvalidFormat =
      false === /^[0-9a-f]{24}$/.test(orphanageId + "");

    if (idHasInvalidFormat) {
      throw new ValidationError<{ orphanageId: string[] }>([
        {
          orphanageId: [
            "Must be a 24-digit string that has only hex characters",
          ],
        },
      ]);
    }

    return this.orphanageLoadByIdRepository.loadById(orphanageId);
  }
}
