import z from "zod";

import type {
  SchemaValidator,
  OrphanageValidationError,
} from "@/data/protocols/db";
import type { OrphanageModel } from "@/domain/models";
import { ValidationError } from "@/presentation/errors";

export class OrphanageLoadByIdSchemaValidator
  implements SchemaValidator<OrphanageModel>
{
  private readonly schema = z.object({
    id: z.string().regex(/^[0-9a-f]{24}$/, {
      message: "Must be a 24-digit string that has only hex characters",
    }),
  });

  validate({
    id,
  }: Partial<OrphanageModel>): SchemaValidator.Result<OrphanageModel> {
    const { error } = this.schema.safeParse({ id });

    if (!error) return;

    const { fieldErrors } = error.flatten();

    const errors = Object.entries(fieldErrors).map(([k, v]) => ({
      [k]: v,
    })) as OrphanageValidationError[];

    return new ValidationError<OrphanageModel>(errors);
  }
}
