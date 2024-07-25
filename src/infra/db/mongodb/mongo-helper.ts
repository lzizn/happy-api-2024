import {
  WithId,
  Document,
  Collection,
  MongoClient,
  ServerApiVersion,
  MongoClientOptions,
} from "mongodb";

const getOptions = (): MongoClientOptions => {
  if (process.env.NODE_ENV === "test") return {};

  return {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  };
};

export const MongoHelper = {
  client: null as unknown as MongoClient,
  uri: null as unknown as string,

  async connect(uri: string) {
    this.uri = uri;
    if (this.client) return this.client;

    this.client = await MongoClient.connect(uri, getOptions());

    return this.client;
  },

  async disconnect() {
    if (this.client) {
      await this.client.close();

      // @ts-expect-error "I don't know how to overlap MongoClient and null"
      this.client = null;
    }
  },

  getCollection<T extends Document>(name: string): Collection<T> {
    return this.client.db().collection(name);
  },

  map: <T>(data: WithId<Document>): T => {
    const { _id, ...rest } = data;
    return { ...rest, id: _id.toString() } as T;
  },

  mapCollection: <T>(collection: WithId<Document>[]): T[] => {
    return collection.map((c) => MongoHelper.map(c));
  },
};
