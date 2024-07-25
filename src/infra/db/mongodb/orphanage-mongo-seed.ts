import { MongoHelper } from "./mongo-helper";
import { OrphanageModel } from "@/domain/models";
import { mockOrphanageModels } from "@/domain/mocks";

export const cleanOrphanagesSeed = async (orphanages?: OrphanageModel[]) => {
  const orphanageCollection =
    MongoHelper.getCollection<OrphanageModel>("orphanage");

  if (!orphanages) {
    await orphanageCollection.deleteMany({});
    return;
  }

  await orphanageCollection.deleteMany({
    _id: {
      $in: orphanages.map((x) => x._id as string),
    },
  });
};

export const seedOrphanages = async (amount: number = 2) => {
  const orphanageCollection =
    MongoHelper.getCollection<OrphanageModel>("orphanage");

  const orphanagesSeed = mockOrphanageModels(amount);

  await orphanageCollection.insertMany(orphanagesSeed);

  const orphanagesDb = await orphanageCollection
    .find({
      _id: {
        $in: orphanagesSeed.map((x) => x._id as string),
      },
    })
    .toArray();

  return {
    orphanagesDb,
    orphanagesSeed,
  };
};
