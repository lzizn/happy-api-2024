import { mockOrphanageModel } from "@/domain/mocks";
import type { OrphanageModel } from "@/domain/models";

import { ValidationError } from "@/presentation/errors";
import { OrphanageUpdateSchemaValidator } from "@/infra/validators";

const makeSut = () => {
  return new OrphanageUpdateSchemaValidator();
};

describe("OrphanageUpdateSchemaValidator", () => {
  it.only("Should return void(undefined) when orphanage is valid", () => {
    const sut = makeSut();
    const orphanage: Partial<OrphanageModel> = mockOrphanageModel();

    const error = sut.validate({
      id: orphanage.id,
      name: "new_name",
      open_on_weekends: false,
    });

    expect(error).toBe(undefined);
  });

  describe("errors", () => {
    it("Should fail when required fields are missing (in this case, only id)", () => {
      const orphanage: Partial<OrphanageModel> = mockOrphanageModel();

      const sut = makeSut();

      const error = sut.validate({
        ...orphanage,
        id: undefined,
      });

      expect(error).toEqual(
        new ValidationError<Partial<OrphanageModel>>([{ id: ["Required"] }])
      );
    });

    it("Should fail when all optional fields are missing", () => {
      const sut = makeSut();

      const error = sut.validate({
        id: "123",
      });

      expect(error).toEqual(
        new ValidationError<{ error: string[] }>([
          { error: ["At least one field is required"] },
        ])
      );
    });

    it("Should fail when providing fields with wrong type", () => {
      const orphanage: Partial<OrphanageModel> = mockOrphanageModel();

      const sut = makeSut();

      const error = sut.validate({
        ...orphanage,
        id: "123",
        name: {},
        instructions: [],
        open_on_weekends: 123,
        opening_hours: 123,
      } as unknown as any);

      expect(error).toEqual(
        new ValidationError<Partial<OrphanageModel>>([
          { id: ["Must be a 24-digit string that has only hex characters"] },
          { name: ["Expected string, received object"] },
          { instructions: ["Expected string, received array"] },
          { open_on_weekends: ["Expected boolean, received number"] },
          { opening_hours: ["Expected string, received number"] },
        ])
      );
    });

    it("Should fail when latitude is not within -90 and 90", () => {
      const orphanage: Partial<OrphanageModel> = mockOrphanageModel();

      const sut = makeSut();

      const error_1 = sut.validate({
        ...orphanage,
        latitude: 91,
      });

      expect(error_1).toEqual(
        new ValidationError<Partial<OrphanageModel>>([
          { latitude: ["Must be greater than -90 and less than 90"] },
        ])
      );

      const error_2 = sut.validate({
        ...orphanage,
        latitude: -91,
      });

      expect(error_2).toEqual(
        new ValidationError<Partial<OrphanageModel>>([
          { latitude: ["Must be greater than -90 and less than 90"] },
        ])
      );
    });

    it("Should fail when longitude is not within -180 and 180", () => {
      const orphanage: Partial<OrphanageModel> = mockOrphanageModel();

      const sut = makeSut();

      const error_1 = sut.validate({
        ...orphanage,
        longitude: 180.5,
      });

      expect(error_1).toEqual(
        new ValidationError<Partial<OrphanageModel>>([
          { longitude: ["Must be greater than -180 and less than 180"] },
        ])
      );

      const error_2 = sut.validate({
        ...orphanage,
        longitude: -180.1,
      });

      expect(error_2).toEqual(
        new ValidationError<Partial<OrphanageModel>>([
          { longitude: ["Must be greater than -180 and less than 180"] },
        ])
      );
    });
  });
});
