import { RemoteFileDelete } from "@/data/usecases";

import type { FileDelete } from "@/domain/usecases";

import { AWSFileDeleter } from "@/infra/cloud";

export const makeFileDelete = (): FileDelete => {
  const fileDeleter = new AWSFileDeleter();

  return new RemoteFileDelete(fileDeleter);
};
