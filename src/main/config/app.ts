import express from "express";
import dotenv from "dotenv";

import setupMiddlewares from "./middlewares";
import setupRoutes from "./routes";
import setupSwagger from "./swagger";

const app = express();

dotenv.config();

setupSwagger(app);
setupMiddlewares(app);
setupRoutes(app);

export { app };
