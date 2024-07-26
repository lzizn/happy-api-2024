import { Collection, ObjectId } from "mongodb";

import type {
  OrphanagesLoadRepository,
  OrphanagesSaveRepository,
  OrphanageLoadByIdRepository,
} from "@/data/protocols/db";
import { MongoHelper } from "@/infra/db/mongodb";
import type { OrphanageModel } from "@/domain/models";

export class OrphanageMongoRepository
  implements
    OrphanagesLoadRepository,
    OrphanagesSaveRepository,
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

  async save(
    orphanage: Partial<OrphanageModel>
  ): Promise<OrphanagesSaveRepository.Result> {
    const orphanagesCollection = this.getCollection();

    const { id, ...orphanageRest } = orphanage;

    const orphanageUpdated = await orphanagesCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...orphanageRest } },
      { upsert: true, returnDocument: "after" }
    );

    return orphanageUpdated ? MongoHelper.map(orphanageUpdated) : null;
  }
}
