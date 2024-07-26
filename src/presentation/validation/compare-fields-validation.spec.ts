import { faker } from "@faker-js/faker";

import { InvalidParamError } from "@/presentation/errors";
import { CompareFieldsValidation } from "@/presentation/validation";

const field = faker.lorem.word({ length: 5 });
const fieldToCompare = faker.lorem.word({ length: 10 });

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation(field, fieldToCompare);
};

describe("CompareFieldsValidation", () => {
  it("Should return InvalidParamError when validation fails (values do not match)", () => {
    const sut = makeSut();

    const result = sut.validate({
      [field]: "some_value",
      [fieldToCompare]: "another_completely_different_value",
    });

    expect(result).toBeInstanceOf(InvalidParamError);
    expect(result).toEqual(new InvalidParamError(fieldToCompare));
  });

  it("Should return nothing when validation success (values are equal)", () => {
    const sut = makeSut();

    const value = "my_mocked_value";

    const error = sut.validate({
      [field]: value,
      [fieldToCompare]: value,
    });

    expect(error).toBeFalsy();
  });
});
