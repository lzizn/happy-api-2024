import { mockOrphanageModel } from "@/domain/mocks";
import type { OrphanageModel } from "@/domain/models";

import { ValidationError } from "@/presentation/errors";
import { OrphanageCreateSchemaValidator } from "@/infra/validators";

const makeSut = () => {
  return new OrphanageCreateSchemaValidator();
};

describe("OrphanageCreateSchemaValidator", () => {
  it("Should return void(undefined) when orphanage is valid", () => {
    const orphanage = mockOrphanageModel();

    const sut = makeSut();

    const error = sut.validate(orphanage);

    expect(error).toBe(undefined);
  });

  describe("errors", () => {
    it("Should fail when required fields are not provided", () => {
      const orphanage: Partial<OrphanageModel> = mockOrphanageModel();

      delete orphanage.name;
      delete orphanage.instructions;

      const sut = makeSut();

      const error = sut.validate(orphanage) as ValidationError<
        Partial<OrphanageModel>
      >;

      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors).toEqual([
        { name: ["Required"] },
        { instructions: ["Required"] },
      ]);
    });

    it("Should fail when providing fields with wrong type", () => {
      const orphanage: Partial<OrphanageModel> = mockOrphanageModel();

      const sut = makeSut();

      const error = sut.validate({
        ...orphanage,
        name: {},
        instructions: [],
        open_on_weekends: 123,
        opening_hours: 123,
        images: 123,
      } as unknown as any) as ValidationError<Partial<OrphanageModel>>;

      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toBe("Validation failed");
      expect(error.errors).toEqual([
        { name: ["Expected string, received object"] },
        { instructions: ["Expected string, received array"] },
        { open_on_weekends: ["Expected boolean, received number"] },
        { opening_hours: ["Expected string, received number"] },
        { images: ["Expected array, received number"] },
      ]);
    });

    it("Should fail when latitude is not within -90 and 90", () => {
      const orphanage: Partial<OrphanageModel> = mockOrphanageModel();

      const sut = makeSut();

      const error_1 = sut.validate({
        ...orphanage,
        latitude: 91,
      }) as ValidationError<Partial<OrphanageModel>>;

      expect(error_1).toBeInstanceOf(ValidationError);
      expect(error_1.errors).toEqual([
        { latitude: ["Must be greater than -90 and less than 90"] },
      ]);

      const error_2 = sut.validate({
        ...orphanage,
        latitude: -91,
      }) as ValidationError<Partial<OrphanageModel>>;

      expect(error_2).toBeInstanceOf(ValidationError);
      expect(error_2.errors).toEqual([
        { latitude: ["Must be greater than -90 and less than 90"] },
      ]);
    });

    it("Should fail when longitude is not within -180 and 180", () => {
      const orphanage: Partial<OrphanageModel> = mockOrphanageModel();

      const sut = makeSut();

      const error_1 = sut.validate({
        ...orphanage,
        longitude: 180.5,
      }) as ValidationError<Partial<OrphanageModel>>;

      expect(error_1).toBeInstanceOf(ValidationError);
      expect(error_1.errors).toEqual([
        { longitude: ["Must be greater than -180 and less than 180"] },
      ]);

      const error_2 = sut.validate({
        ...orphanage,
        longitude: -180.1,
      }) as ValidationError<Partial<OrphanageModel>>;

      expect(error_2).toBeInstanceOf(ValidationError);
      expect(error_2.errors).toEqual([
        { longitude: ["Must be greater than -180 and less than 180"] },
      ]);
    });
  });
});
