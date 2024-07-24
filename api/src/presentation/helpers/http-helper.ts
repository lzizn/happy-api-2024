import { ServerError } from "@/presentation/errors";
import type { HttpResponse } from "@/presentation/protocols";

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(),
});
