import type { Controller } from "@/presentation/protocols";

import type { Request, Response } from "express";

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const request = {
      ...(req.body || {}),
      ...(req.params || {}),
    };
    const { body, statusCode } = await controller.handle(request);

    if (statusCode >= 200 && statusCode <= 299) {
      return res.status(statusCode).json(body);
    }

    res.status(statusCode).json({ error: body.message });
  };
};
