import { makeLogControllerDecorator } from "@/main/factories";

import type { Controller } from "@/presentation/protocols";
import {
  makeDbOrphanageUpdate,
  makeDbOrphanageLoadById,
} from "@/main/factories/usecases";
import { OrphanageUpdateController } from "@/presentation/controllers";

export const makeOrphanageUpdateController = (): Controller => {
  const controller = new OrphanageUpdateController(
    makeDbOrphanageLoadById(),
    makeDbOrphanageUpdate()
  );

  return makeLogControllerDecorator(controller);
};
