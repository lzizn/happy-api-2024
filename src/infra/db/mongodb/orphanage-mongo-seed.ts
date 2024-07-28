import { ObjectId } from "mongodb";

import { MongoHelper } from "@/infra/db";
import { OrphanageModel } from "@/domain/models";
import { mockOrphanageModels } from "@/domain/mocks";

type SeedFunctionResult = {
  fromDb: OrphanageModel[];
  seeds: OrphanageModel[];
};

export type Seeder = {
  seed: (amount?: number) => Promise<SeedFunctionResult>;
  clean: (orphanages?: OrphanageModel[]) => Promise<void>;
};

const OrphanageSeeder = (collection_name: string = "orphanage"): Seeder => {
  const orphanageCollection =
    MongoHelper.getCollection<OrphanageModel>(collection_name);

  return {
    clean: async (orphanages?: OrphanageModel[]) => {
      if (!orphanages) {
        await orphanageCollection.deleteMany({});
        return;
      }

      await orphanageCollection.deleteMany({
        _id: { $in: orphanages.map((x) => new ObjectId(x.id)) },
      });
    },

    seed: async (amount: number = 2) => {
      const seeds = mockOrphanageModels(amount);

      await orphanageCollection.insertMany(seeds);

      const fromDb = MongoHelper.mapCollection<OrphanageModel>(seeds);

      return { seeds, fromDb };
    },
  };
};

export { OrphanageSeeder };
