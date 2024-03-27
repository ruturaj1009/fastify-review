export const addproductSchema = {
    body: {
        type: 'object',
        required: ['name', 'brand_id','price','discount_price'],
        properties: {
          name: { type: 'string', minLength: 1},
          brand_id:{type: 'string'},
          price: { type: 'number'},
          discount_price: { type: 'number'},
          url:{type: 'string', default:"https://google.com"},
          rating:{
            type:'object',
            properties:{
                "5star":{type:'number',default:0},
                "4star":{type:'number',default:0},
                "3star":{type:'number',default:0},
                "2star":{type:'number',default:0},
                "1star":{type:'number',default:0},
                "colour":{type:'string',default:"red"}
            }
          }
        },
      },
    response: {
      201: {
        type: 'object',
        properties: {
          status: { type: 'boolean' },
          message: { type: 'string' },
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