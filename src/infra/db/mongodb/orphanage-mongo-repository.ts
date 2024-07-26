import { Collection, ObjectId } from "mongodb";

import type {
  OrphanagesLoadRepository,
  OrphanagesSaveRepository,
  OrphanageLoadResultRepository,
} from "@/data/protocols/db";
import type { OrphanageModel } from "@/domain/models";
import { MongoHelper, QueryBuilder } from "@/infra/db/mongodb";

export class OrphanageMongoRepository
  implements
    OrphanagesLoadRepository,
    OrphanagesSaveRepository,
    OrphanageLoadResultRepository
{
  getCollection(): Collection<OrphanageModel> {
    return MongoHelper.getCollection<OrphanageModel>("orphanage");
  }

  async loadAll(): Promise<OrphanagesLoadRepository.Result> {
    const orphanagesCollection = this.getCollection();

    const orphanages = await orphanagesCollection.find().toArray();

    return MongoHelper.mapCollection(orphanages);
  }

  async loadResult(
    orphanageId: string | ObjectId
  ): Promise<OrphanageLoadResultRepository.Result> {
    const orphanagesCollection = this.getCollection();

    const query = new QueryBuilder()
      .match({
        _id: orphanageId,
      })
      .build();

    const results = await orphanagesCollection.aggregate(query).toArray();

    const orphanage = results[0]
      ? MongoHelper.map<OrphanageModel>(results[0])
      : null;

    return orphanage;
  }

  async save(
    orphanage: Partial<OrphanageModel>
  ): Promise<OrphanagesSaveRepository.Result> {
    const orphanagesCollection = this.getCollection();

    const { id, _id, ...orphanageRest } = orphanage;

    const orphanageId = id || _id;

    const orphanageUpdated = await orphanagesCollection.findOneAndUpdate(
      { id: orphanageId },
      { $set: { id: orphanageId, ...orphanageRest } },
      { upsert: true, returnDocument: "after" }
    );

    return orphanageUpdated ? MongoHelper.map(orphanageUpdated) : null;
  }
}
