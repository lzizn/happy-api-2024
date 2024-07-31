import {
  makeLogControllerDecorator,
  makeOrphanageDeleteImageValidation,
} from "@/main/factories";

import {
  makeDbOrphanageUpdate,
  makeDbOrphanageLoadById,
} from "@/main/factories/usecases";

import type { Controller } from "@/presentation/protocols";
import { OrphanageDeleteImageController } from "@/presentation/controllers";

export const makeOrphanageDeleteImageController = (): Controller => {
  const validation = makeOrphanageDeleteImageValidation();

  const controller = new OrphanageDeleteImageController(
    makeDbOrphanageUpdate(),
    makeDbOrphanageLoadById(),
    validation
  );

  return makeLogControllerDecorator(controller);
};
