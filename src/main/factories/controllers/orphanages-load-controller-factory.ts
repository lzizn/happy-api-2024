import { makeLogControllerDecorator } from "@/main/factories";

import type { Controller } from "@/presentation/protocols";
import { makeDbOrphanagesLoad } from "@/main/factories/usecases";
import { OrphanagesLoadController } from "@/presentation/controllers";

export const makeOrphanagesLoadController = (): Controller => {
  const controller = new OrphanagesLoadController(makeDbOrphanagesLoad());
  return makeLogControllerDecorator(controller);
};
