import { faker } from "@faker-js/faker";
import { ObjectId } from "mongodb";

import { mockOrphanageModels } from "@/domain/mocks";
import type { OrphanageModel } from "@/domain/models";
import type { OrphanageLoadById, OrphanageUpdate } from "@/domain/usecases";

import {
  NotFoundError,
  ValidationError,
  MissingParamError,
} from "@/presentation/errors";
import type { Validation } from "@/presentation/protocols";
import { ok, badRequest, notFound, noContent } from "@/presentation/helpers";
import { OrphanageDeleteImageController } from "@/presentation/controllers";

const mockOrphanagesWithImages = (amount = 2): OrphanageModel[] => {
  const orphanages = mockOrphanageModels(amount);

  return orphanages.map((x) => {
    const filename = faker.lorem.word(15);
    const extension = ".jpeg";
    const key = "mocked_bucket/" + filename + extension;
    return {
      ...x,
      images: [
        {
          name: filename + extension,
          path: key,
          url: "https://mocked_bucket.s3.amazon/" + key,
        },
      ],
    };
  });
};

const makeOrphanageUpdateSpy = () => {
  class OrphanageUpdateSpy implements OrphanageUpdate {
    input: any;

    async update(
      orphanage: Partial<OrphanageModel>
    ): Promise<OrphanageUpdate.Result> {
      this.input = orphanage;

      return orphanage as OrphanageModel;
    }
  }

  return new OrphanageUpdateSpy();
};

const makeOrphanageLoadByIdSpy = (orphanagesMocks: OrphanageModel[]) => {
  class OrphanageLoadByIdSpy implements OrphanageLoadById {
    orphanagesMocks: OrphanageModel[] = orphanagesMocks;
    input: string = "";

    async loadById(orphanageId: string): Promise<OrphanageLoadById.Result> {
      this.input = orphanageId;

      const match = this.orphanagesMocks.find((x) => x.id === orphanageId);

      return match ?? null;
    }
  }

  return new OrphanageLoadByIdSpy();
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

const makeSut = () => {
  const orphanagesMocked = mockOrphanagesWithImages();

  const orphanageUpdateSpy = makeOrphanageUpdateSpy();
  const orphanageLoadByIdSpy = makeOrphanageLoadByIdSpy(orphanagesMocked);
  const requestValidationSpy = makeRequestValidationSpy();

  const sut = new OrphanageDeleteImageController(
    orphanageUpdateSpy,
    orphanageLoadByIdSpy,
    requestValidationSpy
  );

  return {
    sut,
    orphanagesMocked,
    orphanageUpdateSpy,
    orphanageLoadByIdSpy,
    requestValidationSpy,
  } as const;
};

describe("OrphanageUpdateController", () => {
  // ---- RequestValidation
  it("Should call RequestValidation with correct value", async () => {
    const { sut, requestValidationSpy } = makeSut();

    const request = {
      orphanageId: "123",
      imageKey: "123",
    };
    await sut.handle(request);

    expect(requestValidationSpy.input).toEqual(request);
  });
  it("Should return 400 if RequestValidation returns an error [orphanageId]", async () => {
    const { sut, requestValidationSpy } = makeSut();

    requestValidationSpy.error = new MissingParamError("orphanageId");

    const httpResponse = await sut.handle({
      // @ts-expect-error
      orphanageId: undefined,
      imageKey: faker.lorem.word({ length: 5 }),
    });

    expect(httpResponse).toEqual(badRequest(requestValidationSpy.error));
  });
  it("Should return 400 if RequestValidation returns an error [imageKey]", async () => {
    const { sut, requestValidationSpy } = makeSut();

    requestValidationSpy.error = new MissingParamError("imageKey");

    const httpResponse = await sut.handle({
      orphanageId: "123",
      // @ts-expect-error
      imageKey: undefined,
    });

    expect(httpResponse).toEqual(badRequest(requestValidationSpy.error));
  });

  // ---- OrphanageLoadById
  it("Should call OrphanageLoadById with correct values", async () => {
    const { sut, orphanageLoadByIdSpy } = makeSut();

    const request = {
      orphanageId: new ObjectId().toString(),
      imageKey: faker.lorem.word(),
    };

    await sut.handle(request);

    expect(orphanageLoadByIdSpy.input).toEqual(request.orphanageId);
  });
  it("Should return notFound when OrphanageLoadById can not find a matching orphanage", async () => {
    const { sut, orphanageLoadByIdSpy } = makeSut();

    orphanageLoadByIdSpy.orphanagesMocks = [];

    const request = {
      orphanageId: new ObjectId().toString(),
      imageKey: faker.lorem.word(),
    };

    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(notFound(new NotFoundError("orphanageId")));
  });
  it("Should throw if orphanageId is invalid", async () => {
    const { sut, orphanageLoadByIdSpy } = makeSut();

    const validationError = new ValidationError<{ id: string[] }>([
      { id: ["Must be a 24-digit string that has only hex characters"] },
    ]);
    jest.spyOn(orphanageLoadByIdSpy, "loadById").mockImplementationOnce(() => {
      throw validationError;
    });

    const invalidId = "123";

    try {
      await sut.handle({
        orphanageId: invalidId,
        imageKey: faker.lorem.word({ length: 5 }),
      });
    } catch (e) {
      expect(e).toEqual(validationError);
    }
  });

  // ---- OrphanageUpdate
  it("Should call OrphanageUpdate with correct values", async () => {
    const { sut, orphanageUpdateSpy, orphanagesMocked } = makeSut();

    const request = {
      orphanageId: orphanagesMocked[0].id as string,
      imageKey: orphanagesMocked[0].images![0].path,
    };

    await sut.handle(request);

    expect(orphanageUpdateSpy.input).toEqual({
      id: orphanagesMocked[0].id,
      // * mocked orphanage had only 1 image, which was sent to be deleted
      images: [],
    });
  });
  it("Should throw when OrphanageUpdate throws", async () => {
    const { sut, orphanageUpdateSpy, orphanagesMocked } = makeSut();

    const error = new Error("Caused by test");
    jest.spyOn(orphanageUpdateSpy, "update").mockImplementation(async () => {
      throw error;
    });

    const request = {
      orphanageId: orphanagesMocked[0].id as string,
      imageKey: faker.lorem.word(),
    };

    try {
      await sut.handle(request);
    } catch (e) {
      expect(e).toEqual(error);
    }
  });

  // ---- General
  it("Should return 400 not found when orphanageId does not match any orphanage in DB", async () => {
    const { sut, orphanagesMocked } = makeSut();

    const orphanageTarget = orphanagesMocked[0];
    const imageKey = orphanageTarget.images![0].name;

    const randomId = "00a0a00d00cb0a00000fb000";

    const request = {
      orphanageId: randomId,
      imageKey,
    };

    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(notFound(new NotFoundError("orphanageId")));
  });
  it("Should return 204 when orphanage does not have images to be deleted", async () => {
    const { sut, orphanagesMocked } = makeSut();

    const image = { ...orphanagesMocked[0].images![0] };

    delete orphanagesMocked[0].images;

    const request = {
      orphanageId: orphanagesMocked[0].id as string,
      imageKey: image.path,
    };

    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(noContent());
  });
  it("Should return 200 and updated orphanage when valid data is provided", async () => {
    const { sut, orphanagesMocked } = makeSut();

    const orphanageTarget = orphanagesMocked[0];
    const imageKey = orphanageTarget.images![0].name;

    const request = {
      orphanageId: orphanageTarget.id as string,
      imageKey,
    };

    const httpResponse = await sut.handle(request);

    const expectedData = {
      ...orphanageTarget,
      images: orphanageTarget.images?.filter((x) => x.path !== imageKey),
    };

    expect(httpResponse).toEqual(ok(expectedData));
  });
});
