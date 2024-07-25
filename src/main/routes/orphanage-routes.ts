import { Router } from "express";

import { makeOrphanagesLoadController } from "@/main/factories";
import { adaptRoute } from "@/main/adapters";

export default (router: Router) => {
  router.get("/orphanages", adaptRoute(makeOrphanagesLoadController()));
};
