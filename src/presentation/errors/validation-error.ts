type ErrorItem<T> = {
  [key in keyof T]: string[];
};

export class ValidationError<T> extends Error {
  errors: ErrorItem<T>[] = [];

  constructor(errors: ErrorItem<T>[]) {
    super("Validation failed");
    this.name = "ValidationError";
    this.errors = errors;
  }
}
