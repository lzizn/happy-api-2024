import { Validation } from "@/presentation/protocols";
import { InvalidParamError } from "@/presentation/errors";

export class CompareFieldsValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldToCompareName: string
  ) {}

  validate(input: any): Error | void {
    if (
      typeof input !== "object" ||
      input[this.fieldName] !== input[this.fieldToCompareName]
    ) {
      return new InvalidParamError(this.fieldToCompareName);
    }
  }
}
