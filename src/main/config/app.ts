import express from "express";
import dotenv from "dotenv";

import setupMiddlewares from "./middlewares";
import setupRoutes from "./routes";

const app = express();

dotenv.config();

setupMiddlewares(app);
setupRoutes(app);

export default app;
