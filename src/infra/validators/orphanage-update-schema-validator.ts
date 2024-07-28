import z from "zod";

import type {
  SchemaValidator,
  OrphanageValidationError,
} from "@/data/protocols/db";
import type { OrphanageModel } from "@/domain/models";
import { ValidationError } from "@/presentation/errors";

export class OrphanageUpdateSchemaValidator
  implements SchemaValidator<OrphanageModel>
{
  private readonly schema = z
    .object({
      id: z.string().regex(/^[0-9a-f]{24}$/, {
        message: "Must be a 24-digit string that has only hex characters",
      }),
      name: z.string().optional(),
      description: z.string().optional(),
      instructions: z.string().optional(),
      latitude: z
        .number()
        .min(-90, { message: "Must be greater than -90 and less than 90" })
        .max(90, { message: "Must be greater than -90 and less than 90" })
        .optional(),
      longitude: z
        .number()
        .min(-180, { message: "Must be greater than -180 and less than 180" })
        .max(180, { message: "Must be greater than -180 and less than 180" })
        .optional(),
      open_on_weekends: z.boolean().optional(),
      opening_hours: z.string().optional(),
    })
    .refine(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ id, ...optionalFields }) => Object.keys(optionalFields).length !== 0,
      { message: "At least one field is required" }
    );

  validate(
    orphanage: Partial<OrphanageModel>
  ): SchemaValidator.Result<OrphanageModel> {
    const { error } = this.schema.safeParse(orphanage);

    if (!error) return;

    const { fieldErrors, formErrors } = error.flatten();

    // * generic error, not field-specific
    // * is the case of .refine(), which ensures at least one field is passed
    if (formErrors.length) {
      return new ValidationError([{ error: formErrors }]);
    }

    const errors = Object.entries(fieldErrors).map(([k, v]) => ({
      [k]: v,
    })) as OrphanageValidationError[];

    return new ValidationError<OrphanageModel>(errors);
  }
}
