import { Validation } from "@/presentation/protocols";
import { MissingParamError } from "@/presentation/errors";

export class RequiredFieldValidation implements Validation {
  constructor(private readonly fieldName: string) {}

  validate(input: Record<string, any>): Error | void {
    if (!(this.fieldName in input)) {
      return new MissingParamError(this.fieldName);
    }
  }
}
