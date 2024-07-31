import {
  errorSchema,
  orphanageSchema,
  orphanagesSchema,
  fileUploadedSchema,
  orphanageCreateParamsSchema,
  orphanageUpdateParamsSchema,
  orphanageImageDeleteParamsSchema,
} from "./schemas/";

export default {
  error: errorSchema,
  orphanages: orphanagesSchema,
  orphanage: orphanageSchema,
  fileUploaded: fileUploadedSchema,
  orphanageCreateParams: orphanageCreateParamsSchema,
  orphanageUpdateParams: orphanageUpdateParamsSchema,
  orphanageImageDeleteParams: orphanageImageDeleteParamsSchema,
};
