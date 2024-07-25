import { Router } from "express";

export const OrphanagesRoutes = (router: Router) => {
  router.get("/orphanages", (_, res) => {
    res.status(200).json({ orphanages: [] });
  });
};
