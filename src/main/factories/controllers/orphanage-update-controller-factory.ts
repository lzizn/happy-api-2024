import {
  makeLogControllerDecorator,
  makeOrphanageUpdateValidation,
} from "@/main/factories";

import type { Controller } from "@/presentation/protocols";
import {
  makeDbOrphanageUpdate,
  makeDbOrphanageLoadById,
} from "@/main/factories/usecases";
import { OrphanageUpdateController } from "@/presentation/controllers";

export const makeOrphanageUpdateController = (): Controller => {
  const validation = makeOrphanageUpdateValidation();

  const controller = new OrphanageUpdateController(
    makeDbOrphanageLoadById(),
    makeDbOrphanageUpdate(),
    validation
  );

  return makeLogControllerDecorator(controller);
};
