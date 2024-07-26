import { Collection, ObjectId } from "mongodb";

import type {
  OrphanagesLoadRepository,
  OrphanageLoadByIdRepository,
  OrphanageCreateRepository,
} from "@/data/protocols/db";
import { MongoHelper } from "@/infra/db/mongodb";
import type { OrphanageModel } from "@/domain/models";

export class OrphanageMongoRepository
  implements
    OrphanagesLoadRepository,
    OrphanageCreateRepository,
    OrphanageLoadByIdRepository
{
  getCollection(): Collection<OrphanageModel> {
    return MongoHelper.getCollection<OrphanageModel>("orphanage");
  }

  async loadAll(): Promise<OrphanagesLoadRepository.Result> {
    const orphanagesCollection = this.getCollection();

    const orphanages = await orphanagesCollection.find().toArray();

    return MongoHelper.mapCollection<OrphanageModel>(orphanages);
  }

  async loadById(
    orphanageId: string
  ): Promise<OrphanageLoadByIdRepository.Result> {
    const orphanagesCollection = this.getCollection();

    const orphanage = await orphanagesCollection.findOne({
      _id: new ObjectId(orphanageId),
    });

    return orphanage ? MongoHelper.map<OrphanageModel>(orphanage) : null;
  }

  async create(
    orphanage: Exclude<OrphanageModel, "id">
  ): Promise<OrphanageCreateRepository.Result> {
    const orphanagesCollection = this.getCollection();

    await orphanagesCollection.insertOne(orphanage);

    return MongoHelper.map(orphanage);
  }
}
