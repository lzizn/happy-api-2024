import { faker } from "@faker-js/faker";

import { serverError, ok } from "@/presentation/helpers";
import { LogControllerDecorator } from "@/main/decorators";
import type { LogErrorRepository } from "@/data/protocols";
import type { Controller, HttpResponse } from "@/presentation/protocols";

const makeLogRepository = () => {
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
  const logErrorRepository = makeLogRepository();

  const sut = new LogControllerDecorator(anyController, logErrorRepository);

  return {
    sut,
    anyController,
    logErrorRepository,
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

  it("Should call LogErrorRepository with correct error if controller returns a server error", async () => {
    const { sut, anyController, logErrorRepository } = makeSut();

    const mockServerError = (): HttpResponse => {
      const fakeError = new Error("Caused by test");
      fakeError.stack = "any_stack";
      return serverError(fakeError);
    };

    const error = mockServerError();

    anyController.httpResponse = error;

    await sut.handle(faker.lorem.sentence());

    expect(logErrorRepository.stack).toBe(error.body.stack);
  });
});
