import {
  ValidationComposite,
  RequiredFieldValidation,
} from "@/presentation/validation";
import { Validation } from "@/presentation/protocols";

export const makeOrphanageDeleteImageValidation = (): Validation => {
  const validations: Validation[] = [
    new RequiredFieldValidation("orphanageId"),
    new RequiredFieldValidation("imageKey"),
  ];

  return new ValidationComposite(validations);
};
