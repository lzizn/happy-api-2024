import { Express, Router } from "express";

import FileRoutes from "@/main/routes/file-routes";
import OrphanageRoutes from "@/main/routes/orphanage-routes";

export default (app: Express) => {
  const router = Router();

  app.use("/api", router);

  OrphanageRoutes(router);
  FileRoutes(router);
};
