import { Collection, ObjectId } from "mongodb";

import type {
  OrphanagesLoadRepository,
  OrphanageLoadResultRepository,
} from "@/data/protocols/db";
import type { OrphanageModel } from "@/domain/models";
import { MongoHelper, QueryBuilder } from "@/infra/db/mongodb";

export class OrphanageMongoRepository
  implements OrphanagesLoadRepository, OrphanageLoadResultRepository
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
}
