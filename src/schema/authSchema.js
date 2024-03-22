export const registerSchema = {
    body: {
        type: 'object',
        required: ['name', 'email', 'password', 'phone', 'address'],
        properties: {
          name: { type: 'string', minLength: 1},
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 5 },
          phone: { type: 'string', minLength: 10,maxLength:10 },
          address: { type: 'string', minLength: 1 },
          admin:{type: 'boolean', default:false},
        },
      },
    response: {
      201: {
        type: 'object',
        properties: {
          status: { type: 'boolean' },
          message: { type: 'string' },
          // res: {
          //   type: 'object',
          //   properties: {
          //     name: { type: 'string' },
          //     email: { type: 'string' },
          //     phone: { type: 'string' },
          //     address: { type: 'string' },
          //   },
          // },
          token: {type: 'string'},
        },
      },
      400: {
        type: 'object',
        properties: {
          status: { type: 'boolean', default: false },
          message: { type: 'string' },
          errors: { type: 'array' },
        },
      },
      404: {
        type: 'object',
        properties: {
          status: { type: 'boolean', default: false },
          message: { type: 'string' },
          error: { type: 'string' },
        },
      },
      500: {
        type: 'object',
        properties: {
          status: { type: 'boolean', default: false },
          message: { type: 'string' },
          error: { type: 'string' },
        },
      },
    },
  };
  
export const loginSchema = {
    body:{
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 5 },
      },
    },
    response:{
      200: {
        type: 'object',
        properties: {
          status: { type: 'boolean' },
          message: { type: 'string' },
          // res: {
          //   type: 'object',
          //   properties: {
          //     _id :{type: 'string'},
          //     name: { type: 'string' },
          //     email: { type: 'string' },
          //     phone: { type: 'string' },
          //     address: { type: 'string' },
          //   },
          // },
          token: {type: 'string'},
        },
      },
      400: {
        type: 'object',
        properties: {
          status: { type: 'boolean', default: false },
          message: { type: 'string' },
          errors: { type: 'array' },
        },
      },
      404: {
        type: 'object',
        properties: {
          status: { type: 'boolean', default: false },
          message: { type: 'string' },
          error: { type: 'string' },
        },
      },
      500: {
        type: 'object',
        properties: {
          status: { type: 'boolean', default: false },
          message: { type: 'string' },
          error: { type: 'string' },
        },
      },
    }
}