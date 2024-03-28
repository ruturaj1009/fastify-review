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
    const brandId = req.params.id;
    const { page = 1, size = 9 } = req.query; 
    const pagenum = Math.max(1, parseInt(page));
    const elemsize = Math.max(9, parseInt(size));

    const [brandname, pagedata] = await Promise.all([
      app.mongo.db.collection("brand").findOne({ _id: new ObjectId(brandId) }),
      app.mongo.db.collection("product")
        .find({ brand_id: brandId }, { projection: { brand_id: 0 } })
        .skip((pagenum - 1) * elemsize)
        .limit(elemsize)
        .toArray(),
    ]);

    if (!brandname) {
      return reply.code(404).send({
        status: false,
        message: "Brand not found",
      });
    }

    if (pagedata.length === 0) {
      return reply.code(404).send({
        status: false,
        message: "No products found for this brand",
      });
    }

    return reply.send({
      status: true,
      message: "Data fetched successfully",
      page: pagenum,
      size: pagedata.length, 
      brand: brandname.brand_name,
      res: pagedata,
    });
  } catch (error) {
    console.error(error); 
    return reply.code(500).send({
      status: false,
      message: "Internal Server Error", 
    });
  }
};


export const addsingleProduct = async (app, req, reply) => {
  try {
    const { name, url, price, discount_price } = req.body;
    if (!name || !url || !price || !discount_price) {
      return reply.code(400).send({
        status: false,
        message: "All fields (name, url, price, discount_price) are required",
      });
    }

    const collection = await app.mongo.db.collection("product");
    const eproduct = slugify(name, { lower: true, trim: true });
    const [existingProduct, userData] = await Promise.all([
      collection.findOne({ slug: eproduct }),
      {
        name: slugify(name, { replacement: " ", trim: true }),
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
          color: "red",
        },
      },
    ]);

    if (existingProduct) {
      return reply.code(409).send({
        status: false,
        message: "Product already exists",
      });
    }

    const { insertedId } = await collection.insertOne(userData);
    return reply.send({
      status: true,
      message: "Product registered successfully",
    });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({
      status: false,
      message: "Internal server error",
    });
  }
};

