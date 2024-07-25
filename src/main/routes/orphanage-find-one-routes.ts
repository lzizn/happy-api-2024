import { Router } from "express";

import { makeOrphanageLoadResultController } from "@/main/factories";
import { adaptRoute } from "@/main/adapters";

export default (router: Router) => {
  router.get(
    "/orphanages/:orphanageId",
    adaptRoute(makeOrphanageLoadResultController())
  );
};
