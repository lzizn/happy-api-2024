import { MongoHelper } from "@/infra/db/mongodb";
import type { OrphanageModel } from "@/domain/models";
import type { OrphanagesLoadRepository } from "@/data/protocols/db";

export class OrphanageMongoRepository implements OrphanagesLoadRepository {
  async loadAll(): Promise<OrphanagesLoadRepository.Result> {
    const orphanagesCollection = MongoHelper.getCollection("orphanage");

    const orphanages = await orphanagesCollection.find().toArray();

    return MongoHelper.mapCollection<OrphanageModel>(orphanages);
  }
}
