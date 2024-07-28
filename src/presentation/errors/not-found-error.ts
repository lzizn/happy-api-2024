export class NotFoundError extends Error {
  constructor(paramName: string) {
    super(`Resource not found. Could not find resource by ${paramName}`);

    this.name = "NotFoundError";
  }
}
