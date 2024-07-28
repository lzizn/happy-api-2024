import { faker } from "@faker-js/faker";

import { LogControllerDecorator } from "@/main/decorators";

import type { LogErrorRepository } from "@/data/protocols";

import {
  NotFoundError,
  ServerError,
  ValidationError,
  InvalidParamError,
  MissingParamError,
} from "@/presentation/errors";
import { ok } from "@/presentation/helpers";
import type { Controller, HttpResponse } from "@/presentation/protocols";

const makeLogRepositorySpy = () => {
  class LogErrorRepositorySpy implements LogErrorRepository {
    stack: string = "";

    async logError(stack: string): Promise<void> {
      this.stack = stack;
    }
  }
  return new LogErrorRepositorySpy();
};

const makeController = () => {
  class AnyAbstractController implements Controller {
    httpResponse = ok(faker.string.uuid());

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(request: any): Promise<HttpResponse> {
      return this.httpResponse;
    }
  }

  return new AnyAbstractController();
};

const makeSut = () => {
  const anyController = makeController();
  const logErrorRepositorySpy = makeLogRepositorySpy();

  const sut = new LogControllerDecorator(anyController, logErrorRepositorySpy);

  return {
    sut,
    anyController,
    logErrorRepositorySpy,
  } as const;
};

describe("LogController Decorator", () => {
  it("Should call controller.handle", async () => {
    const { sut, anyController } = makeSut();

    const anyControllerSpy = jest.spyOn(anyController, "handle");

    const request = faker.lorem.sentence();
    await sut.handle(request);

    expect(anyControllerSpy).toHaveBeenCalled();
    expect(anyControllerSpy).toHaveBeenCalledWith(request);
  });

  it("Should return the same result of the controller", async () => {
    const { sut, anyController } = makeSut();

    const httpResponse = await sut.handle(faker.lorem.sentence());

    expect(httpResponse).toEqual(anyController.httpResponse);
  });

  it("Should return 400 bad request when controller throws MissingParamError", async () => {
    const { sut, anyController } = makeSut();

    const error = new MissingParamError("any_id");
    jest.spyOn(anyController, "handle").mockImplementationOnce(async () => {
      throw error;
    });

    const response = await sut.handle(faker.lorem.sentence());

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(error);
  });

  it("Should return 400 bad request when controller throws InvalidParamError", async () => {
    const { sut, anyController } = makeSut();

    const error = new InvalidParamError("any_id");
    jest.spyOn(anyController, "handle").mockImplementationOnce(async () => {
      throw error;
    });

    const response = await sut.handle(faker.lorem.sentence());

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(error);
  });

  it("Should return 400 bad request when controller throws ValidationError", async () => {
    const { sut, anyController } = makeSut();

    const error = new ValidationError([
      {
        error: ["any_id is required"],
      },
    ]);
    jest.spyOn(anyController, "handle").mockImplementationOnce(async () => {
      throw error;
    });

    const response = await sut.handle(faker.lorem.sentence());

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(error);
  });

  it("Should return 404 not found when controller throws NotFoundError", async () => {
    const { sut, anyController } = makeSut();

    const error = new NotFoundError({ paramName: "any_id " });
    jest.spyOn(anyController, "handle").mockImplementationOnce(async () => {
      throw error;
    });

    const response = await sut.handle(faker.lorem.sentence());

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual(error);
  });

  it("Should return 500 server error when controller throws an unknown error", async () => {
    const { sut, anyController } = makeSut();

    const error = new Error("caused by test");
    jest.spyOn(anyController, "handle").mockImplementationOnce(async () => {
      throw error;
    });

    const response = await sut.handle(faker.lorem.sentence());

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError(error.stack));
  });

  it("Should call LogErrorRepository with error message and stack when controller throws an unknown error", async () => {
    const { sut, anyController, logErrorRepositorySpy } = makeSut();

    const error = new Error("caused by test");
    jest.spyOn(anyController, "handle").mockImplementationOnce(async () => {
      throw error;
    });

    const response = await sut.handle(faker.lorem.sentence());

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError(error.stack));

    expect(logErrorRepositorySpy.stack).toBe(
      `message:${error.message}; stack:${error.stack}`
    );
  });
});
