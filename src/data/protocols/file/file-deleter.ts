export interface FileDeleter {
  delete: (fileKey: string) => FileDeleter.Result;
}

export namespace FileDeleter {
  export type Result = Promise<void | Error>;
}
