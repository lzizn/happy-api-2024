import {
  ValidationComposite,
  RequiredFieldValidation,
} from "@/presentation/validation";
import { Validation } from "@/presentation/protocols";

export const makeOrphanageUpdateValidation = (): Validation => {
  const validations: Validation[] = [
    new RequiredFieldValidation("orphanageId"),
  ];

  return new ValidationComposite(validations);
};
