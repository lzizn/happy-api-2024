import {
  makeLogControllerDecorator,
  makeOrphanageCreateValidation,
} from "@/main/factories";

import type { Controller } from "@/presentation/protocols";
import { makeDbOrphanageCreate } from "@/main/factories/usecases";
import { OrphanageCreateController } from "@/presentation/controllers";

export const makeOrphanageCreateController = (): Controller => {
  const validation = makeOrphanageCreateValidation();

  const controller = new OrphanageCreateController(
    makeDbOrphanageCreate(),
    validation
  );

  return makeLogControllerDecorator(controller);
};
