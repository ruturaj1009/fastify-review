import { ObjectId } from "@fastify/mongodb";
import slugify from "slugify";

export const getallProducts = async (app, req, reply) => {
  try {
    const pagenum = Math.max(1, parseInt(req.query.page || 1));
    const elemsize = Math.max(9, parseInt(req.query.size || 9));
    const start = (pagenum - 1) * elemsize;
    const collection = await app.mongo.db.collection("product");
    const pagedata = await collection
      .find({}, { projection: { brand_id: 0 } })
      .skip(start)
      .limit(elemsize)
      .toArray();
    const size = Object.keys(pagedata).length;
    if (pagedata.length === 0) {
      reply.code(404).send({
        status: false,
        message: "No product found",
      });
    } else {
      reply.send({
        status: true,
        page: pagenum,
        size: size,
        message: "Data fetched successfully",
        res: pagedata,
      });
    }
  } catch (error) {
    console.log(error);
    reply.code(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export const getsingleProduct = async (app, req, reply) => {
  try {
    const { id } = req.params;
    const collection = await app.mongo.db.collection("product");
    const data = await collection.findOne({ _id: new ObjectId(id) });
    if (data === null || data === undefined) {
      return reply.code(400).send({
        status: false,
        message: "No data found",
      });
    }
    return reply.send({
      status: true,
      message: "Data fetched successfully",
      res: data,
    });
  } catch (error) {
    console.log(error);
    return reply.code(500).send({
      status: false,
      message: "Internal Server Error or Invalid Id",
    });
  }
};

export const getbrandProduct = async (app, req, reply) => {
  try {
    const brand_id = req.params.id;
    const brandcollection = await app.mongo.db.collection("brand");
    const brandname = await brandcollection.findOne({
      _id: new ObjectId(brand_id),
    });
    if (!brandname) {
      return reply.code(400).send({
        status: false,
        message: "Invalid brand id",
      });
    }
    const pagenum = Math.max(1, parseInt(req.query.page || 1));
    const elemsize = Math.max(9, parseInt(req.query.size || 9));
    const start = (pagenum - 1) * elemsize;
    const collection = await app.mongo.db.collection("product");
    const pagedata = await collection
      .find({ brand_id }, { projection: { brand_id: 0 } })
      .skip(start)
      .limit(elemsize)
      .toArray();
    const size = Object.keys(pagedata).length;
    if (pagedata.length === 0) {
      return reply.code(404).send({
        status: false,
        message: "No product found",
      });
    } else {
      return reply.send({
        status: true,
        message: "Data fetched successfully",
        page: pagenum,
        size: size,
        brand: brandname.brand_name,
        res: pagedata,
      });
    }
  } catch (error) {
    console.log(error);
    return reply.code(500).send({
      status: false,
      message: "Internal Server Error or Invalid Id",
    });
  }
};

export const addsingleProduct = async (app, req, reply) => {
  try {
    const { name, url, price, discount_price } = req.body;
    if (!name || !price || !discount_price) {
      return reply.code(400).send({
        status: false,
        message: "All fields are required",
      });
    }
    const collection = await app.mongo.db.collection("product");
    const eproduct = slugify(name,{lower: true,trim: true});
    const pname = await collection.findOne({ slug: eproduct });
    if (pname) {
      return reply.code(404).send({
        status: false,
        message: "Product already registered...",
      });
    }
    const userData = {
      name:slugify(name,{replacement:' ',trim:true}),
      slug: eproduct,
      url,
      price,
      discount_price,
      rating: {
        "5star": 0,
        "4star": 0,
        "3star": 0,
        "2star": 0,
        "1star": 0,
        "color":"red"
      },
    };
    const { insertedId } = await collection.insertOne(userData);
    if (insertedId) {
      return reply.send({
        status: true,
        message: "Product registered successfully",
      });
    } else {
      return reply.code(500).send({
        status: false,
        message: "Something went wrong. Please try again",
      });
    }
  } catch (error) {
    console.log(error);
    return reply.code(500).send({
      status: false,
      message: "Internal server error",
      error: error,
    });
  }
};
