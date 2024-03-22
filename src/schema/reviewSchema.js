export const reviewSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" },
    },
  },
  body: {
    type: "object",
    required: ["star", "comment"],
    properties: {
      star: { type: "number", default: 1, minimum: 1, maximum: 5 },
      comment: { type: "string", minLength: 5, maxLength: 200 },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
        // res: {
        //   type: "object",
        //   properties: {
        //     _id: { type: "string" },
        //     star: { type: "number" },
        //     comment: { type: "string" },
        //     pname :{type: "string" }
        //   },
        // },
      },
    },
    201: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
        // res: {
        //   type: "object",
        //   properties: {
        //     _id: { type: "string" },
        //     user_id: { type: "string" },
        //     product_id: { type: "string" },
        //     star: { type: "number" },
        //     comment: { type: "string" },
        //   },
        // },
      },
    },
    400: {
      type: "object",
      properties: {
        status: { type: "boolean", default: false },
        message: { type: "string" },
        errors: { type: "array" },
      },
    },
    404: {
      type: "object",
      properties: {
        status: { type: "boolean", default: false },
        message: { type: "string" },
        error: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean", default: false },
        message: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

export const deletereviewSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
        // res: {
        //   type: "object",
        //   properties: {
        //     _id: { type: "string" },
        //     user_id: { type: "string" },
        //     product_id: { type: "string" },
        //     star: { type: "number" },
        //     comment: { type: "string" },
        //   },
        // },
      },
    },
    400: {
      type: "object",
      properties: {
        status: { type: "boolean", default: false },
        message: { type: "string" },
        errors: { type: "array" },
      },
    },
    404: {
      type: "object",
      properties: {
        status: { type: "boolean", default: false },
        message: { type: "string" },
        error: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean", default: false },
        message: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};


export const allreviewSchema = {
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        page: { type: "number" },
        size: { type: "number" },
        message: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              user_name: { type: "string" },
              product_name: { type: "string" },
              star: { type: "number" },
              comment: { type: "string" }
            },
            required: ["_id", "user_name", "product_name", "star", "comment"]
          }
        }
      },
      required: ["status", "page", "size", "message", "data"]
    },
    400: {
      type: "object",
      properties: {
        status: { type: "boolean", default: false },
        message: { type: "string" },
        errors: { type: "array" },
      },
    },
    404: {
      type: "object",
      properties: {
        status: { type: "boolean", default: false },
        message: { type: "string" },
        error: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean", default: false },
        message: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};
