export const orphanageImagePath = {
  delete: {
    summary: "Delete an orphanage image",
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
            $ref: "#/schemas/orphanageImageDeleteParams",
          },
        },
      },
    },
    responses: {
      200: {
        description: "Successfully deleted",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/orphanage",
            },
          },
        },
      },
      204: {
        description:
          "No images to delete or provided key does not match existing images",
      },
      400: {
        $ref: "#/components/badRequest",
      },
      404: {
        $ref: "#/components/notFound",
      },
      500: {
        $ref: "#/components/serverError",
      },
    },
  },
};
