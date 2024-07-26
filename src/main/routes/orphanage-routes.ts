import { Router } from "express";

import {
  makeOrphanagesLoadController,
  makeOrphanageCreateController,
  makeOrphanageLoadByIdController,
} from "@/main/factories";
import { adaptRoute } from "@/main/adapters";

export default (router: Router) => {
  router.get("/orphanages", adaptRoute(makeOrphanagesLoadController()));
  router.post("/orphanages", adaptRoute(makeOrphanageCreateController()));
  router.get(
    "/orphanages/:orphanageId",
    adaptRoute(makeOrphanageLoadByIdController())
  );
};
