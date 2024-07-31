import { faker } from "@faker-js/faker";

import type { File, OrphanageModel } from "@/domain/models";
import { mockFile, mockOrphanageModel } from "@/domain/mocks";
import type { FileUpload, OrphanageCreate } from "@/domain/usecases";

import type { SchemaValidator } from "@/data/protocols/db";

import type { Validation } from "@/presentation/protocols";
import { badRequest, created } from "@/presentation/helpers";
import { OrphanageCreateController } from "@/presentation/controllers";
import { MissingParamError, ValidationError } from "@/presentation/errors";

const makeFileUploadSpy = () => {
  class FileUploadStub implements FileUpload {
    input?: File[];
    error?: Error;

    async upload(files: File[]): FileUpload.Result {
      this.input = files;

      if (this.error) throw this.error;

      return files.map(({ name, extension }) => ({
        path: `mocked_bucket/${name}${extension}`,
      }));
    }
  }

  return new FileUploadStub();
};

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

const makeRequestValidationSpy = () => {
  class RequestValidationSpy implements Validation {
    error: Error | undefined;
    input: any;

    validate(input: any): Error | undefined {
      this.input = input;
      return this.error;
    }
  }

  return new RequestValidationSpy();
};

const makeOrphanageCreateSpy = (
  schemaValidatorSpy: SchemaValidator<OrphanageModel>
) => {
  class OrphanageCreateStub implements OrphanageCreate {
    input: Exclude<OrphanageModel, "id"> | undefined;

    async create(
      orphanage: Exclude<OrphanageModel, "id">
    ): Promise<OrphanageCreate.Result> {
      this.input = orphanage;

      const error = schemaValidatorSpy.validate(orphanage);

      if (error) throw error;

      return {
        ...orphanage,
        id: "mocked_id" + Math.random() * 1000,
      } as OrphanageCreate.Result;
    }
  }

  return new OrphanageCreateStub();
};

const makeSut = () => {
  const fileUploadSpy = makeFileUploadSpy();
  const validationSpy = makeRequestValidationSpy();
  const schemaValidatorSpy = makeOrphanageCreateSchemaValidatorSpy();
  const orphanageCreateSpy = makeOrphanageCreateSpy(schemaValidatorSpy);

  const sut = new OrphanageCreateController(
    fileUploadSpy,
    orphanageCreateSpy,
    validationSpy
  );

  return {
    sut,
    fileUploadSpy,
    validationSpy,
    orphanageCreateSpy,
    schemaValidatorSpy,
  } as const;
};

describe("OrphanageCreateController", () => {
  // ---- RequestValidation
  it("Should call Validation with correct value", async () => {
    const { sut, validationSpy } = makeSut();

    const request = { name: faker.lorem.word() };
    await sut.handle(request);

    expect(validationSpy.input).toEqual(request);
  });
  it("Should return 400 if Validation returns an error", async () => {
    const { sut, validationSpy } = makeSut();

    validationSpy.error = new MissingParamError("instructions");

    const httpResponse = await sut.handle({
      name: faker.lorem.word({ length: 5 }),
    });

    expect(httpResponse).toEqual(badRequest(validationSpy.error));
  });

  // ---- OrphanageCreateSchemaValidator
  it("Should call OrphanageCreateSchemaValidator with correct values", async () => {
    const { sut, schemaValidatorSpy } = makeSut();

    const request = { name: faker.lorem.word() };
    await sut.handle(request);

    expect(schemaValidatorSpy.input).toEqual(request);
  });
  it("Should throw when OrphanageCreateSchemaValidator returns a ValidationError", async () => {
    const { sut, schemaValidatorSpy } = makeSut();

    const validationError = new ValidationError<{ error: string[] }>([
      {
        error: ["Caused by test"],
      },
    ]);

    jest.spyOn(schemaValidatorSpy, "validate").mockImplementation(() => {
      return validationError;
    });

    try {
      await sut.handle({});
    } catch (e) {
      expect(e).toEqual(validationError);
    }
  });

  // ---- OrphanageCreate
  it("Should call OrphanageCreate with correct values", async () => {
    const { sut, orphanageCreateSpy } = makeSut();

    const request = { name: faker.lorem.word() };
    await sut.handle(request);

    expect(orphanageCreateSpy.input).toEqual(request);
  });
  it("Should return 500 when OrphanageCreate throws", async () => {
    const { sut, orphanageCreateSpy } = makeSut();

    const error = new Error("Caused by test");
    jest.spyOn(orphanageCreateSpy, "create").mockImplementation(async () => {
      throw error;
    });

    try {
      await sut.handle({});
    } catch (e) {
      expect(e).toEqual(error);
    }
  });

  // ---- FileUpload
  it("Should call FileUpload with correct values", async () => {
    const { sut, fileUploadSpy } = makeSut();

    const files = [mockFile(), mockFile()];
    const request = {
      name: faker.lorem.word(),
      files,
    };

    await sut.handle(request);

    // * we can't match .input to request.files because
    // * because in OrphanageCreateController we delete orphanage.files to avoid it going further in app
    expect(fileUploadSpy.input).toEqual(files);
  });
  it("Should return 500 when FileUpload throws", async () => {
    const { sut, fileUploadSpy } = makeSut();

    const error = new Error("Caused by test");
    jest.spyOn(fileUploadSpy, "upload").mockImplementation(async () => {
      throw error;
    });

    try {
      await sut.handle({});
    } catch (e) {
      expect(e).toEqual(error);
    }
  });

  // ---- General
  it("Should parse different values of open_on_weekends to boolean", async () => {
    const { sut, orphanageCreateSpy } = makeSut();

    const orphanageMock = mockOrphanageModel();

    // prettier-ignore
    const cases = [
      { value: true,     expected: true  },
      { value: "true",   expected: true  },
      { value: "1",      expected: true  },
      { value: 1,        expected: true  },
      
      { value: false,    expected: false },
      { value: "false",  expected: false },
      { value: "0",      expected: false },
      { value: 0,        expected: false },

      { value: undefined, expected: false },
      { value: null,     expected: false },
      { value: {},       expected: false },
      { value: [],       expected: false },
    ];

    for (const { expected, value } of cases) {
      await sut.handle({
        ...orphanageMock,
        // @ts-expect-error
        open_on_weekends: value,
      });

      expect(orphanageCreateSpy.input?.open_on_weekends).toBe(expected);
    }
  });

  it("Should parse string latitude/longitude to number", async () => {
    const { sut, orphanageCreateSpy } = makeSut();

    const orphanageMock = mockOrphanageModel();

    // prettier-ignore
    const cases = [
      { value: 89.5,     expected: 89.5     },
      { value: "75.12",  expected: 75.12    },
      { value: undefined, expected: undefined },
      { value: null,     expected: null     },
      { value: {},       expected: {}       },
      { value: [],       expected: []       },
    ];

    for (const { expected, value } of cases) {
      await sut.handle({
        ...orphanageMock,
        // @ts-expect-error
        latitude: value,
        // @ts-expect-error
        longitude: value,
      });

      expect(orphanageCreateSpy.input?.latitude).toEqual(expected);
      expect(orphanageCreateSpy.input?.longitude).toEqual(expected);
    }
  });
  it("Should return 201 and created orphanage when valid data is provided", async () => {
    const { sut } = makeSut();

    const orphanage: Partial<OrphanageModel> = mockOrphanageModel();

    delete orphanage.id;

    const response = await sut.handle(orphanage);

    const expectedData = {
      ...orphanage,
      id: response.body.id,
    };

    expect(response).toEqual(created(expectedData));
  });
  it("Should return 201 with orphanage and images when valid data is provided", async () => {
    const { sut } = makeSut();

    const orphanage: Partial<OrphanageModel> = mockOrphanageModel();

    delete orphanage.id;

    const files = [mockFile(), mockFile()];
    const response = await sut.handle({
      ...orphanage,
      files,
    });

    const expectedData = {
      ...orphanage,
      id: response.body.id,
      images: [
        { path: "mocked_bucket/" + files[0].name + files[0].extension },
        { path: "mocked_bucket/" + files[1].name + files[1].extension },
      ],
    };

    expect(response).toEqual(created(expectedData));
  });
  it("Should create new orphanage even if same orphanage already exists and its 'id' is provided", async () => {
    const { sut } = makeSut();

    const orphanage: Partial<OrphanageModel> = mockOrphanageModel();

    // creating once
    const response_1 = await sut.handle({ ...orphanage });

    expect(response_1).toEqual(
      created({
        ...orphanage,
        id: response_1.body.id,
      })
    );

    // creating twice, by providing exact same object, including same id
    const response_2 = await sut.handle({
      ...orphanage,
      id: response_1.body.id,
    });

    expect(response_2).toEqual(
      created({
        ...orphanage,
        id: response_2.body.id,
      })
    );

    expect(response_1.body.id).not.toBe(response_2.body.id);
  });
});
