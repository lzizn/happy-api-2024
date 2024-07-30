import { File } from "@/domain/models";
import { Request, Response, NextFunction } from "express";

export const fileHandler = (req: Request, _: Response, next: NextFunction) => {
  const { files } = req;

  if (!Array.isArray(files)) return next();

  const toFile = (file: Express.Multer.File): File => {
    const lastDotIndex = file.originalname.lastIndexOf(".");

    const filename = file.originalname.slice(0, lastDotIndex);
    const fileExtension = file.originalname.slice(lastDotIndex);

    return {
      size: file.size,
      name: filename,
      type: file.mimetype,
      extension: fileExtension,
      content: file.buffer,
    };
  };

  const mappedFiles = files.map(toFile);

  Object.assign(req.body, { files: mappedFiles });
  return next();
};
