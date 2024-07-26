import { Router } from "express";

import {
  makeOrphanagesLoadController,
  makeOrphanageLoadByIdController,
} from "@/main/factories";
import { adaptRoute } from "@/main/adapters";

export default (router: Router) => {
  router.get("/orphanages", adaptRoute(makeOrphanagesLoadController()));
  router.get(
    "/orphanages/:orphanageId",
    adaptRoute(makeOrphanageLoadByIdController())
  );
};
