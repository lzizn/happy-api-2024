import { mockOrphanageModel } from "@/domain/mocks";
import type { OrphanageModel } from "@/domain/models";

import { ValidationError } from "@/presentation/errors";
import { OrphanageLoadByIdSchemaValidator } from "@/infra/validators";

const makeSut = () => {
  return new OrphanageLoadByIdSchemaValidator();
};

describe("OrphanageLoadByIdSchemaValidator", () => {
  it("Should return void(undefined) when orphanageId is valid", () => {
    const orphanage = mockOrphanageModel();

    const sut = makeSut();

    const errors = sut.validate({ id: orphanage.id });

    expect(errors).toBe(undefined);
  });

  describe("errors", () => {
    it("Should fail when orphanageId is not provided for some reason", () => {
      const orphanage: Partial<OrphanageModel> = mockOrphanageModel();

      delete orphanage.id;

      const sut = makeSut();

      const errors = sut.validate(orphanage);

      expect(errors).toEqual(
        new ValidationError<Partial<OrphanageModel>>([{ id: ["Required"] }])
      );
    });

    it("Should fail when id is invalid", () => {
      const sut = makeSut();

      const errors = sut.validate({
        id: "123",
      });

      expect(errors).toEqual(
        new ValidationError<Partial<OrphanageModel>>([
          { id: ["Must be a 24-digit string that has only hex characters"] },
        ])
      );
    });
  });
});
