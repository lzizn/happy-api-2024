export const orphanageUpdateParamsSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    longitude: {
      type: "number",
    },
    latitude: {
      type: "number",
    },
    description: {
      type: "string",
    },
    instructions: {
      type: "string",
    },
    opening_hours: {
      type: "string",
    },
    open_on_weekends: {
      type: "boolean",
    },
  },
};
