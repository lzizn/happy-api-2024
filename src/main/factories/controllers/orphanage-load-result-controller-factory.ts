import { makeLogControllerDecorator } from "@/main/factories";

import type { Controller } from "@/presentation/protocols";
import { makeDbOrphanageLoadResult } from "@/main/factories/usecases";
import { OrphanageLoadResultController } from "@/presentation/controllers";

export const makeOrphanageLoadResultController = (): Controller => {
  const controller = new OrphanageLoadResultController(
    makeDbOrphanageLoadResult()
  );
  return makeLogControllerDecorator(controller);
};
