import { faker } from "@faker-js/faker";

import { MissingParamError } from "@/presentation/errors";
import { RequiredFieldValidation } from "@/presentation/validation";

const field = faker.lorem.word({ length: 5 });

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation(field);
};

describe("RequiredField Validation", () => {
  it("Should return a MissingParamError when validation fails (field is not a key of input)", () => {
    const sut = makeSut();

    const objectToValidate = {
      invalidField: faker.lorem.word({ length: 10 }),
    };

    const result = sut.validate(objectToValidate);

    expect(result).toBeInstanceOf(MissingParamError);
    expect(result).toEqual(new MissingParamError(field));
  });

  it("Should not return if validation succeeds (field is key of input)", () => {
    const sut = makeSut();

    const objectToValidate = {
      [field]: false,
    };

    const error = sut.validate(objectToValidate);
    expect(error).toBeFalsy();
  });
});
