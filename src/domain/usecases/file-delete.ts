export interface FileDelete {
  delete: (fileKey: string) => FileDelete.Result;
}

export namespace FileDelete {
  export type Result = Promise<void | Error>;
}
