export const orphanageCreateParamsSchema = {
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
    files: {
      type: "string",
      format: "binary",
      maxItems: 6,
    },
  },
  required: [
    "name",
    "longitude",
    "latitude",
    "description",
    "instructions",
    "opening_hours",
    "open_on_weekends",
  ],
};
