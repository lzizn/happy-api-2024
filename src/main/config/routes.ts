import { Express, Router } from "express";

import OrphanageRoutes from "@/main/routes/orphanage-routes";
import OrphanageResultRoutes from "@/main/routes/orphanage-result-routes";

export default (app: Express) => {
  const router = Router();

  app.use("/api", router);

  OrphanageRoutes(router);
  OrphanageResultRoutes(router);
};
