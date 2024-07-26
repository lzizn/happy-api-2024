export class NotFoundError extends Error {
  constructor({
    resourceName,
    paramName,
  }: {
    resourceName?: string;
    paramName?: string;
  }) {
    if (paramName) {
      super(`Resource not found. Could not find resource by ${paramName}`);
    } else if (resourceName) {
      super(`Resource not found. Could not find resource ${resourceName}`);
    } else {
      super("Resource not found");
    }

    this.name = "NotFoundError";
  }
}
