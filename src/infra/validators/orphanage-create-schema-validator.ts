import z from "zod";

import type {
  SchemaValidator,
  OrphanageValidationError,
} from "@/data/protocols/db";
import type { OrphanageModel } from "@/domain/models";
import { ValidationError } from "@/presentation/errors";

export class OrphanageCreateSchemaValidator
  implements SchemaValidator<OrphanageModel>
{
  private readonly schema = z.object({
    name: z.string(),
    description: z.string(),
    instructions: z.string(),
    latitude: z
      .number()
      .min(-90, { message: "Must be greater than -90 and less than 90" })
      .max(90, { message: "Must be greater than -90 and less than 90" }),
    longitude: z
      .number()
      .min(-180, { message: "Must be greater than -180 and less than 180" })
      .max(180, { message: "Must be greater than -180 and less than 180" }),
    open_on_weekends: z.boolean(),
    opening_hours: z.string(),
    images: z
      .array(
        z.object({
          path: z.string(),
        })
      )
      .optional(),
  });

  validate(
    orphanage: Partial<OrphanageModel>
  ): SchemaValidator.Result<OrphanageModel> {
    const { error } = this.schema.safeParse(orphanage);

    if (!error) return;

    const { fieldErrors } = error.flatten();

    const errors = Object.entries(fieldErrors).map(([k, v]) => ({
      [k]: v,
    })) as OrphanageValidationError[];

    return new ValidationError<OrphanageModel>(errors);
  }
}
