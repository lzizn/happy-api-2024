import multer, { MulterError } from "multer";
import { NextFunction, Request, Response } from "express";

const config = {
  field: "files",
  limitFileAmount: 6,
  maxFile: {
    amount: 3 * 1024 * 1024,
    label: "3MB",
  },
};

const storage = multer.memoryStorage();
const parseFiles = multer({
  storage,
  limits: {
    fileSize: config.maxFile.amount,
  },
}).array(config.field, config.limitFileAmount);

export const multerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const codeToMessage: Record<string, string> = {
    LIMIT_UNEXPECTED_FILE: `Files must be attached to property '${config.field}'`,
    LIMIT_FILE_SIZE: `File is too big. Max file size is ${config.maxFile.label}`,
  };

  parseFiles(req, res, (error: unknown) => {
    if (error instanceof MulterError) {
      const message =
        error.code in codeToMessage ? codeToMessage[error.code] : error.message;

      return res.status(400).json({ error: error.code, message });
    }

    if (error instanceof Error) {
      return res
        .status(400)
        .json({ error: error.name, message: error.message });
    }

    if (error) {
      return res
        .status(500)
        .json({ error: "Server Error", message: "Internal Server Error" });
    }

    next();
  });
};
