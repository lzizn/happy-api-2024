import { faker } from "@faker-js/faker";

import type { Validation } from "@/presentation/protocols";
import { MissingParamError } from "@/presentation/errors";
import { ValidationComposite } from "@/presentation/validation";

const field = faker.lorem.word({ length: 10 });

const makeValidationSpy = () => {
  class ValidationSpy implements Validation {
    error: Error | undefined;
    input: any;

    validate(input: any): Error | undefined {
      this.input = input;
      return this.error;
    }
  }

  return new ValidationSpy();
};

const makeSut = () => {
  const validationSpies = [makeValidationSpy(), makeValidationSpy()];
  const sut = new ValidationComposite(validationSpies);
  return {
    sut,
    validationSpies,
  } as const;
};

describe("Validation Composite", () => {
  it("Should return an error when any validation fails", () => {
    const { sut, validationSpies } = makeSut();

    validationSpies[1].error = new MissingParamError(field);

    const error = sut.validate({ [field]: faker.lorem.word({ length: 20 }) });
    expect(error).toEqual(validationSpies[1].error);
  });

  it("Should return the first error when more than one validation fails", () => {
    const { sut, validationSpies } = makeSut();

    validationSpies[0].error = new Error();
    validationSpies[1].error = new MissingParamError(field);

    const error = sut.validate({ [field]: faker.lorem.word({ length: 20 }) });

    expect(error).toEqual(validationSpies[0].error);
  });

  it("Should not return when validation succeeds", () => {
    const { sut } = makeSut();

    const result = sut.validate({ [field]: faker.lorem.word({ length: 20 }) });

    expect(result).toBe(undefined);
  });
});
