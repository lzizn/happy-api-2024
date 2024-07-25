import { Router } from "express";

import { adaptRoute } from "@/main/adapters";
import { makeOrphanagesLoadController } from "@/main/factories";

export const OrphanagesRoutes = (router: Router) => {
  router.get("/orphanages", adaptRoute(makeOrphanagesLoadController()));
};
