import { FileUpload } from "@/domain/usecases";
import { RemoteFileUpload } from "@/data/usecases";

import { AWSFileUploader } from "@/infra/cloud";

export const makeFileUpload = (): FileUpload => {
  const fileUploader = new AWSFileUploader();

  return new RemoteFileUpload(fileUploader);
};
