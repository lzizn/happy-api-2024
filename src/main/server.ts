import "module-alias/register";
import { configDotenv } from "dotenv";

import { getEnv } from "@/main/config/env";
import { MongoHelper } from "@/infra/db";

configDotenv();

const env = getEnv();

if (!env.database_url) {
  throw new Error("DATABASE_URL variable is missing");
}

MongoHelper.connect(env.database_url)
  .then(async () => {
    const { app } = await import("./config/app");

    app.listen(80, () => console.log(`Server running at http://localhost:80`));
  })
  .catch((x) => {
    console.log("Failed to initialize server: ", x.message);
  });
