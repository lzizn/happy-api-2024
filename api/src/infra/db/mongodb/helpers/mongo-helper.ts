import { Collection, Document, MongoClient, ServerApiVersion } from "mongodb";

const DEFAULT_URI = process.env.MONGO_URL;

export const MongoHelper = {
  client: null as null | MongoClient,

  async connect(uri: string) {
    if (this.client) return this.client;

    this.client = await MongoClient.connect(uri, {
      // serverApi: {
      //   version: ServerApiVersion.v1,
      //   strict: true,
      //   deprecationErrors: true,
      // },
    });

    return this.client;
  },

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
  },

  async getCollection<T extends Document>(
    name: string
  ): Promise<Collection<T>> {
    if (!this.client) {
      this.client = await this.connect(DEFAULT_URI as string);
    }

    return this.client.db().collection(name);
  },
};
