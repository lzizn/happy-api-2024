import {
  makeLogControllerDecorator,
  makeOrphanageDeleteImageValidation,
} from "@/main/factories";

import {
  makeFileDelete,
  makeDbOrphanageUpdate,
  makeDbOrphanageLoadById,
} from "@/main/factories/usecases";

import type { Controller } from "@/presentation/protocols";
import { OrphanageDeleteImageController } from "@/presentation/controllers";

export const makeOrphanageDeleteImageController = (): Controller => {
  const validation = makeOrphanageDeleteImageValidation();

  const fileDeleter = makeFileDelete();

  const controller = new OrphanageDeleteImageController(
    fileDeleter,
    makeDbOrphanageUpdate(),
    makeDbOrphanageLoadById(),
    validation
  );

  return makeLogControllerDecorator(controller);
};
