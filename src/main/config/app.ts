import express from "express";
import dotenv from "dotenv";

import setupMiddlewares from "./middlewares";

const app = express();

dotenv.config();

setupMiddlewares(app);
export default app;
