export type SchemaValidator<T> = {
  isValid(object: T | Partial<T>): SchemaValidator.Result<T>;
};
export namespace SchemaValidator {
  export type Result<T> =
    | void
    | {
        [key in keyof T]?: string[];
      };
}
