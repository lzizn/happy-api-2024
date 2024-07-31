import { Router } from "express";

import {
  makeOrphanagesLoadController,
  makeOrphanageUpdateController,
  makeOrphanageCreateController,
  makeOrphanageLoadByIdController,
} from "@/main/factories";
import { adaptRoute } from "@/main/adapters";
import { fileHandler, multerMiddleware } from "@/main/middlewares";

export default (router: Router) => {
  router.get("/orphanages", adaptRoute(makeOrphanagesLoadController()));

  router.post(
    "/orphanages",
    multerMiddleware,
    fileHandler,
    adaptRoute(makeOrphanageCreateController())
  );

  router.patch(
    "/orphanages/:orphanageId",
    adaptRoute(makeOrphanageUpdateController())
  );
  router.get(
    "/orphanages/:orphanageId",
    adaptRoute(makeOrphanageLoadByIdController())
  );
};
