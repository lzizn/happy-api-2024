import { Express, Router } from "express";

import OrphanageRoutes from "@/main/routes/orphanage-routes";
import OrphanageFindOneRoutes from "@/main/routes/orphanage-find-one-routes";

export default (app: Express) => {
  const router = Router();

  app.use("/api", router);

  OrphanageRoutes(router);
  OrphanageFindOneRoutes(router);
};
