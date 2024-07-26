import { ObjectId } from "mongodb";
import { faker } from "@faker-js/faker";

import { OrphanageModel } from "@/domain/models";

export const mockOrphanageModel = (): OrphanageModel => {
  return {
    id: new ObjectId().toString(),
    description: faker.lorem.words(10),
    instructions: faker.lorem.words(2),
    open_on_weekends: faker.datatype.boolean(),
    name: faker.person.fullName(),
    latitude: faker.number.float({ min: -90, max: 90 }),
    longitude: faker.number.float({ min: -180, max: 180 }),
    opening_hours: "Mon-Sun 7am-7pm",
  };
};

export const mockOrphanageModels = (amount: number = 2): OrphanageModel[] =>
  new Array(amount).fill(null).map(mockOrphanageModel);
