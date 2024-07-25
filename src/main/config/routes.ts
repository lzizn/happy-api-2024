import { Express, Router } from "express";

import { OrphanagesRoutes } from "@/main/routes";

export default (app: Express) => {
  const router = Router();

  app.use("/api", router);

  OrphanagesRoutes(router);
};
