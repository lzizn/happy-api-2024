import { FileUploadError } from "@/domain/errors";

describe("FileUploadError", () => {
  it("Should have properties message and name", () => {
    const error = new FileUploadError();

    expect(error.name).toEqual("FileUploadError");
    expect(error.message).toEqual("Error while uploading file(s)");
  });
});
