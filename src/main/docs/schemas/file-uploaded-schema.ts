export const fileUploadedSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    url: {
      type: "string",
    },
    path: {
      type: "string",
    },
  },
  required: ["name", "url", "path"],
};
