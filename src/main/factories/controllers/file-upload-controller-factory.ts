import type { Controller } from "@/presentation/protocols";
import { FileUploadController } from "@/presentation/controllers";

import { makeFileUpload } from "@/main/factories/usecases";
import { makeLogControllerDecorator } from "@/main/factories";

export const makeFileUploadController = (): Controller => {
  const fileUpload = makeFileUpload();

  const controller = new FileUploadController(fileUpload);

  return makeLogControllerDecorator(controller);
};
