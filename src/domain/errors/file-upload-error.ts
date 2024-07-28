export class FileUploadError extends Error {
  constructor() {
    super("Error while uploading file(s)");
    this.name = "FileUploadError";
  }
}
