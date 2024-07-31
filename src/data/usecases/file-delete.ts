import type { FileDelete } from "@/domain/usecases";

import type { FileDeleter } from "@/data/protocols/file";

export class RemoteFileDelete implements FileDelete {
  constructor(private readonly fileDeleter: FileDeleter) {}

  async delete(fileKey: string): FileDelete.Result {
    return this.fileDeleter.delete(fileKey);
  }
}
