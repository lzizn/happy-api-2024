export const errorSchema = {
  type: "object",
  properties: {
    error: {
      type: "string",
    },
    message: {
      type: "string",
    },
    errors: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: {
          type: "array",
          items: {
            type: "string",
            description: "Descriptive error of why it failed",
          },
        },
      },
    },
  },
  required: ["error", "message"],
};
