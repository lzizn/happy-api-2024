import { ServerError } from "@/presentation/errors";
import type { HttpResponse } from "@/presentation/protocols";

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack),
});

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null,
});

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});
