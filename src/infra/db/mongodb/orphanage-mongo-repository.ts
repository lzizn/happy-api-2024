import { Collection } from "mongodb";

import { MongoHelper } from "@/infra/db/mongodb";
import type { OrphanageModel } from "@/domain/models";
import type { OrphanagesLoadRepository } from "@/data/protocols/db";

export class OrphanageMongoRepository implements OrphanagesLoadRepository {
  getCollection(): Collection<OrphanageModel> {
    return MongoHelper.getCollection<OrphanageModel>("orphanage");
  }

  async loadAll(): Promise<OrphanagesLoadRepository.Result> {
    const orphanagesCollection = this.getCollection();

    const orphanages = await orphanagesCollection.find().toArray();

    return MongoHelper.mapCollection(orphanages);
  }
}
