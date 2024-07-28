import type { LogErrorRepository } from "@/data/protocols/db";

import {
  NotFoundError,
  ValidationError,
  InvalidParamError,
  MissingParamError,
} from "@/presentation/errors";
import { badRequest, notFound, serverError } from "@/presentation/helpers";
import type { Controller, HttpResponse } from "@/presentation/protocols";

export class LogControllerDecorator implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository
  ) {}

  async handle(request: any): Promise<HttpResponse> {
    try {
      const httpResponse = await this.controller.handle(request);

      return httpResponse;
    } catch (error) {
      if (
        error instanceof ValidationError ||
        error instanceof InvalidParamError ||
        error instanceof MissingParamError
      ) {
        return badRequest(error);
      }

      if (error instanceof NotFoundError) {
        return notFound(error);
      }

      const _error = error as unknown as Error;

      await this.logErrorRepository.logError(
        `message:${_error.message}; stack:${_error?.stack}`
      );

      return serverError(_error);
    }
  }
}
