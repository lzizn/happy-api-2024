import { mockOrphanageModels } from "@/domain/mocks";
import type { OrphanageModel } from "@/domain/models";

import { DbOrphanageCreate } from "@/data/usecases";
import type {
  SchemaValidator,
  OrphanageCreateRepository,
} from "@/data/protocols/db";

import { ValidationError } from "@/presentation/errors";

const makeOrphanageCreateSchemaValidatorSpy = () => {
  class OrphanageCreateSchemaValidatorSpy
    implements SchemaValidator<OrphanageModel>
  {
    input: OrphanageModel | Partial<OrphanageModel> = {};
    validate(
      orphanage: OrphanageModel | Partial<OrphanageModel>
    ): SchemaValidator.Result<OrphanageModel> {
      this.input = orphanage;
      return;
    }
  }

  return new OrphanageCreateSchemaValidatorSpy();
};
const makeOrphanageCreateRepositorySpy = () => {
  class OrphanageCreateRepositorySpy implements OrphanageCreateRepository {
    error?: Error;
    input?: OrphanageModel;

    async create(
      orphanage: Exclude<OrphanageModel, "id">
    ): Promise<OrphanageCreateRepository.Result> {
      this.input = orphanage;

      return {
        ...orphanage,
        id: "mocked_id",
      };
    }
  }

  return new OrphanageCreateRepositorySpy();
};

const makeSut = () => {
  const schemaValidatorSpy = makeOrphanageCreateSchemaValidatorSpy();
  const orphanageCreateRepository = makeOrphanageCreateRepositorySpy();

  const sut = new DbOrphanageCreate(
    orphanageCreateRepository,
    schemaValidatorSpy
  );

  return {
    sut,
    schemaValidatorSpy,
    orphanageCreateRepository,
  } as const;
};

describe("DbOrphanageCreate", () => {
  // ---- OrphanageCreateRepository
  it("Should call OrphanageCreateRepository", async () => {
    const { sut, orphanageCreateRepository } = makeSut();
    const [orphanageMock] = mockOrphanageModels(1);

    await sut.create(orphanageMock);

    expect(orphanageCreateRepository.input).toEqual(orphanageMock);
  });
  it("Should throw if OrphanageCreateRepository throws", async () => {
    const { sut, orphanageCreateRepository } = makeSut();
    const [orphanageMock] = mockOrphanageModels(1);

    jest
      .spyOn(orphanageCreateRepository, "create")
      .mockImplementationOnce(async () => {
        throw new Error("Caused by it");
      });

    const promise = sut.create(orphanageMock);
    await expect(promise).rejects.toThrow();
  });

  // ---- OrphanageCreateSchemaValidator
  it("Should call OrphanageCreateSchemaValidator", async () => {
    const { sut, schemaValidatorSpy } = makeSut();
    const [orphanageMock] = mockOrphanageModels(1);

    await sut.create(orphanageMock);

    expect(schemaValidatorSpy.input).toEqual(orphanageMock);
  });
  it("Should throw if OrphanageCreateSchemaValidator returns error", async () => {
    const { sut, schemaValidatorSpy } = makeSut();
    const [orphanageMock] = mockOrphanageModels(1);

    const validationError = new ValidationError<{ error: string[] }>([
      {
        error: ["Caused by test"],
      },
    ]);

    jest.spyOn(schemaValidatorSpy, "validate").mockImplementationOnce(() => {
      return validationError;
    });

    try {
      sut.create(orphanageMock);
    } catch (e) {
      expect(e).toEqual(validationError);
    }
  });

  // ---- General
  it("Should return created orphanage", async () => {
    const { sut } = makeSut();

    const [orphanageMock] = mockOrphanageModels(1);

    const orphanage = await sut.create(orphanageMock);

    expect(orphanage).toEqual({
      ...orphanageMock,
      id: "mocked_id",
    });
  });
});
