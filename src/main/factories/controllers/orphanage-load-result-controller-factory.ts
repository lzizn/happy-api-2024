import { makeLogControllerDecorator } from "@/main/factories";

import type { Controller } from "@/presentation/protocols";
import { makeDbOrphanageLoadById } from "@/main/factories/usecases";
import { OrphanageLoadByIdController } from "@/presentation/controllers";

export const makeOrphanageLoadByIdController = (): Controller => {
  const controller = new OrphanageLoadByIdController(makeDbOrphanageLoadById());
  return makeLogControllerDecorator(controller);
};
