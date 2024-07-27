import { Router } from "express";

import {
  makeOrphanagesLoadController,
  makeOrphanageUpdateController,
  makeOrphanageCreateController,
  makeOrphanageLoadByIdController,
} from "@/main/factories";
import { adaptRoute } from "@/main/adapters";

export default (router: Router) => {
  router.get("/orphanages", adaptRoute(makeOrphanagesLoadController()));
  router.post("/orphanages", adaptRoute(makeOrphanageCreateController()));
  router.patch(
    "/orphanages/:orphanageId",
    adaptRoute(makeOrphanageUpdateController())
  );
  router.get(
    "/orphanages/:orphanageId",
    adaptRoute(makeOrphanageLoadByIdController())
  );
};
