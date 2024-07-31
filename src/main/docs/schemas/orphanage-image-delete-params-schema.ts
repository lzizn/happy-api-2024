export const orphanageImageDeleteParamsSchema = {
  type: "object",
  properties: {
    imageKey: {
      type: "string",
    },
  },
  required: ["imageKey"],
};
