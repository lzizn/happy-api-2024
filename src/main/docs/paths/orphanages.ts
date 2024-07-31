export const orphanagesPath = {
  get: {
    summary: "List all orphages",
    // description:
    //   "Essa rota só pode ser executada por **usuários autenticados**",
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/orphanages",
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
  post: {
    summary: "Create an orphanage",
    requestBody: {
      required: true,
      content: {
        "multipart-/form-data": {
          schema: {
            $ref: "#/schemas/orphanageCreateParams",
          },
        },
      },
    },
    responses: {
      201: {
        description: "Successfully created",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/orphanage",
            },
          },
        },
      },
      500: {
        $ref: "#/components/serverError",
      },
    },
  },
};
