import { ObjectId } from "mongodb";

import { MongoHelper } from "@/infra/db";
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
    _id: { $in: orphanages.map((x) => new ObjectId(x.id)) },
  });
};

export const seedOrphanages = async (amount: number = 2) => {
  const orphanageCollection =
    MongoHelper.getCollection<OrphanageModel>("orphanage");

  const orphanagesSeed = mockOrphanageModels(amount);

  const orphanagesWithIds = orphanagesSeed.map((x) => {
    const { id, ...rest } = x;
    return { _id: new ObjectId(id), ...rest };
  });

  await orphanageCollection.insertMany(orphanagesWithIds);

  const orphanagesDb = await orphanageCollection
    .find({ _id: { $in: orphanagesWithIds.map((x) => x._id) } })
    .toArray();

  return {
    orphanagesDb: MongoHelper.mapCollection<OrphanageModel>(orphanagesDb),
    orphanagesSeed,
  };
};
