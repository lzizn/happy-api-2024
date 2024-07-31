import {
  errorSchema,
  orphanageSchema,
  orphanagesSchema,
  fileUploadedSchema,
  orphanageCreateParamsSchema,
  orphanageUpdateParamsSchema,
} from "./schemas/";

export default {
  error: errorSchema,
  orphanages: orphanagesSchema,
  orphanage: orphanageSchema,
  fileUploaded: fileUploadedSchema,
  orphanageCreateParams: orphanageCreateParamsSchema,
  orphanageUpdateParams: orphanageUpdateParamsSchema,
};
