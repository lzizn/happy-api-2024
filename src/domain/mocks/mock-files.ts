import { faker } from "@faker-js/faker";

import { File } from "@/domain/models";

export const mockFile = (): File => ({
  size: 3,
  name: faker.lorem.word(15),
  content: Buffer.from("123"),
  type: "image/jpeg",
  extension: ".jpeg",
});
