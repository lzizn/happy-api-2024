import { Router } from "express";

import { adaptRoute } from "@/main/adapters";
import { makeFileUploadController } from "@/main/factories";
import { fileHandler, multerMiddleware } from "@/main/middlewares";

export default (router: Router) => {
  router.post(
    "/orphanages/images",
    multerMiddleware,
    fileHandler,
    adaptRoute(makeFileUploadController())
  );
};
