export const orphanageSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
    },
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
    images: {
      type: "array",
      items: {
        $ref: "#/schemas/fileUploaded",
      },
    },
  },
  required: [
    "id",
    "name",
    "longitude",
    "latitude",
    "description",
    "instructions",
    "opening_hours",
    "open_on_weekends",
    "images",
  ],
};
