import type { Express } from "express";

import { bodyParser, contentType, cors } from "../middlewares";

export default (app: Express): void => {
  app.use(cors);
  app.use(bodyParser);
  app.use(contentType);
};
