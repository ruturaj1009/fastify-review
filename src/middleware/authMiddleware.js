import { ObjectId } from "@fastify/mongodb";

export const isRegistered = async(req,reply)=>{
  try {
    await req.jwtVerify();
  } catch (error) {
    return reply.code(401).send({
      "status":false,
      "message":"Unauthorized Access. Kindly login to continue"
    });
  }
};


export const isAdmin = (app) => {
  return async (req, reply) => { 
    try {
      const collection = app.mongo.db.collection("user");
      const user = await collection.findOne(
        { _id: new ObjectId(req.user.uid) },
        { projection: { password: 0 } }
      );
      if (!user || !user.admin) {
        return reply.code(401).send({
          status: false,
          message: "Unauthorized access to admin routes.",
        });
      }
    
    } catch (error) {
      console.log(error);
      return reply.code(500).send({
        status: false,
        message: "Internal server error",
        error: error
      });
    }
  };
};


