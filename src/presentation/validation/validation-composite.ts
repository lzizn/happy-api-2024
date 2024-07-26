import { Validation } from "@/presentation/protocols";

export class ValidationComposite implements Validation {
  constructor(private readonly validations: Validation[]) {}

  validate(input: any): Error | void {
    for (const validation of this.validations) {
      const maybeError = validation.validate(input);

      if (maybeError) return maybeError;
    }
  }
}
