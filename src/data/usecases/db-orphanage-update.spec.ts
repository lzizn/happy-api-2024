import { OrphanageModel } from "@/domain/models";
import { mockOrphanageModels } from "@/domain/mocks";

import { DbOrphanageUpdate } from "@/data/usecases";
import { OrphanageUpdateRepository, SchemaValidator } from "@/data/protocols";

import { ValidationError } from "@/presentation/errors";

const makeOrphanageUpdateSchemaValidatorSpy = () => {
  class OrphanageUpdateSchemaValidatorSpy
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

  return new OrphanageUpdateSchemaValidatorSpy();
};

const makeOrphanageUpdateRepositorySpy = () => {
  class OrphanageUpdateRepositorySpy implements OrphanageUpdateRepository {
    error?: Error;
    input?: Partial<OrphanageModel>;
    orphanageComplete?: OrphanageModel;

    async update(
      input: Partial<OrphanageModel>
    ): Promise<OrphanageUpdateRepository.Result> {
      this.input = input;

      return {
        ...(this.orphanageComplete || {}),
        ...input,
      } as OrphanageModel;
    }
  }

  return new OrphanageUpdateRepositorySpy();
};

const makeSut = () => {
  const schemaValidatorSpy = makeOrphanageUpdateSchemaValidatorSpy();
  const orphanageUpdateRepository = makeOrphanageUpdateRepositorySpy();

  const sut = new DbOrphanageUpdate(
    orphanageUpdateRepository,
    schemaValidatorSpy
  );

  return {
    sut,
    schemaValidatorSpy,
    orphanageUpdateRepository,
  } as const;
};

describe("DbOrphanageUpdate", () => {
  // ---- OrphanageUpdateRepository
  it("Should call OrphanageUpdateRepository", async () => {
    const { sut, orphanageUpdateRepository } = makeSut();

    const orphanageNewData = {
      id: "any_id",
      name: "new_name",
    };

    await sut.update(orphanageNewData);

    expect(orphanageUpdateRepository.input).toEqual(orphanageNewData);
  });
  it("Should throw if OrphanageUpdateRepository throws", async () => {
    const { sut, orphanageUpdateRepository } = makeSut();

    jest
      .spyOn(orphanageUpdateRepository, "update")
      .mockImplementationOnce(async () => {
        throw new Error("Caused by it");
      });

    const promise = sut.update({ id: "any", name: "will fail anyway" });
    await expect(promise).rejects.toThrow();
  });

  // ---- OrphanageUpdateSchemaValidator
  it("Should call OrphanageUpdateSchemaValidator", async () => {
    const { sut, schemaValidatorSpy } = makeSut();

    const orphanageNewData = {
      id: "new",
      name: "more_new",
    };

    await sut.update(orphanageNewData);

    expect(schemaValidatorSpy.input).toEqual({
      id: orphanageNewData.id,
      name: orphanageNewData.name,
    });
  });
  it("Should throw if OrphanageUpdateSchemaValidator returns an error", async () => {
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
      sut.update(orphanageMock);
    } catch (e) {
      expect(e).toEqual(validationError);
    }
  });

  // ---- General
  it("Should return updated orphanage", async () => {
    const { sut, orphanageUpdateRepository } = makeSut();

    const [orphanageMock] = mockOrphanageModels(1);

    orphanageUpdateRepository.orphanageComplete = orphanageMock;

    const orphanageNewData = {
      id: "my_new_id",
      name: "my_new_name",
    };

    const orphanage = await sut.update(orphanageNewData);

    expect(orphanage).toEqual({
      ...orphanageMock,
      id: orphanageNewData.id,
      name: orphanageNewData.name,
    });
  });
});
