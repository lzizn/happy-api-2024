import { ValidationError } from "@/presentation/errors";

type GenericError = {
  error: string[];
};

export type SchemaValidator<T> = {
  validate(input: T | Partial<T>): SchemaValidator.Result<T>;
};
export namespace SchemaValidator {
  export type Result<T> =
    | ValidationError<GenericError>
    | ValidationError<T>
    | void;
}
