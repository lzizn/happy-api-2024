import {
  makeLogControllerDecorator,
  makeOrphanageCreateValidation,
} from "@/main/factories";

import {
  makeFileUpload,
  makeDbOrphanageCreate,
} from "@/main/factories/usecases";

import type { Controller } from "@/presentation/protocols";
import { OrphanageCreateController } from "@/presentation/controllers";

export const makeOrphanageCreateController = (): Controller => {
  const validation = makeOrphanageCreateValidation();
  const fileUpload = makeFileUpload();

  const controller = new OrphanageCreateController(
    fileUpload,
    makeDbOrphanageCreate(),
    validation
  );

  return makeLogControllerDecorator(controller);
};
