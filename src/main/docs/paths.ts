import { orphanagesPath, orphanagePath, orphanageImagePath } from "./paths/";

export default {
  "/orphanages": orphanagesPath,
  "/orphanages/:orphanageId": orphanagePath,
  "/orphanages/:orphanageId/images": orphanageImagePath,
};
