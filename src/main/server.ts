import "module-alias/register";
import { ObjectId } from "mongodb";
import { configDotenv } from "dotenv";

import { getEnv } from "@/main/config/env";
import { MongoHelper } from "@/infra/db";
import { mockOrphanageModels } from "@/domain/mocks";

configDotenv();

const env = getEnv();

if (!env.database_url) {
  throw new Error("DATABASE_URL variable is missing");
}

MongoHelper.connect(env.database_url)
  .then(async (mongoClient) => {
    const { app } = await import("./config/app");

    app.listen(80, () => console.log(`Server running at http://localhost:80`));

    const orphanageCollection = mongoClient.db().collection("orphanage");

    const orphanagesAmount = await orphanageCollection.countDocuments();

    if (orphanagesAmount === 0) {
      const orphanagesSeed = mockOrphanageModels(20);
      orphanageCollection.insertMany(
        orphanagesSeed.map((x) => ({ ...x, _id: new ObjectId() }))
      );
    }
  })
  .catch((x) => {
    console.log("Failed to initialize server: ", x.message);
  });
