import {
  ValidationComposite,
  RequiredFieldValidation,
} from "@/presentation/validation";
import { Validation } from "@/presentation/protocols";

import { OrphanageModel } from "@/domain/models";

export const makeOrphanageCreateValidation = (): Validation => {
  const validations: Validation[] = [];

  const requiredFields: (keyof OrphanageModel)[] = [
    "name",
    "latitude",
    "longitude",
    "description",
    "instructions",
    "opening_hours",
    "open_on_weekends",
  ];

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field));
  }

  return new ValidationComposite(validations);
};
