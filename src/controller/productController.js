import { ObjectId } from "@fastify/mongodb";

export const getallProducts = async(app,req,reply)=>{
    try {
        const pagenum = Math.max(1, parseInt(req.query.page || 1));
        const elemsize = Math.max(9, parseInt(req.query.size || 9));
        const start = (pagenum - 1) * elemsize;
        const collection = await app.mongo.db.collection("product");
        const pagedata = await collection
          .find({},{ projection: { brand_id: 0 } })
          .skip(start)
          .limit(elemsize)
          .toArray();
        const size = await Object.keys(pagedata).length;
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
            res:pagedata
          });
        }
      } catch (error) {
        console.log(error);
        reply.code(500).send({
          status: false,
          message: "Internal Server Error",
        });
      }
}

export const getsingleProduct = async(app,req,reply)=>{
    try {
        const { id } = req.params;
        const collection = await app.mongo.db.collection("product");
        const data = await collection.findOne(
          { _id: new ObjectId(id) }
        );
        if (data === null || data === undefined) {
          return reply.code(400).send({
            status: false,
            message: "No data found",
          });
        }
        return reply.send({
          status: true,
          message: "Data fetched successfully",
          res:data,
        });
      } catch (error) {
        console.log(error);
        return reply.code(500).send({
          status: false,
          message: "Internal Server Error or Invalid Id",
        });
      }
}

export const getbrandProduct = async(app,req,reply)=>{
    try {
        const brand_id = req.params.id;
        const brandcollection = await app.mongo.db.collection("brand");
        const brandname = await brandcollection.findOne({_id: new ObjectId(brand_id)});
        if(!brandname){
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
          .find({brand_id},{ projection: { brand_id: 0 } })
          .skip(start)
          .limit(elemsize)
          .toArray();
        const size = await Object.keys(pagedata).length;
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
            brand:brandname.brand_name,
            res:pagedata
          });
        }

    } catch (error) {
        console.log(error);
        return reply.code(500).send({
          status: false,
          message: "Internal Server Error or Invalid Id",
        });
    }
}

export const addsingleProduct = async(app,req,reply)=>{
    
}