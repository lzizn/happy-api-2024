export const orphanagePath = {
  get: {
    summary: "Get orphanage details",
    parameters: [
      {
        in: "path",
        name: "orphanageId",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/orphanage",
            },
          },
        },
      },
      204: {
        description: "Success, but no data to show",
      },
      400: {
        $ref: "#/components/badRequest",
      },
      500: {
        $ref: "#/components/serverError",
      },
    },
  },
  patch: {
    summary: "Update an orphanage",
    parameters: [
      {
        in: "path",
        name: "orphanageId",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/schemas/orphanageUpdateParams",
          },
        },
      },
    },
    responses: {
      200: {
        description: "Successfully updated",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/orphanage",
            },
          },
        },
      },
      400: {
        $ref: "#/components/badRequest",
      },
      500: {
        $ref: "#/components/serverError",
      },
    },
  },
};
