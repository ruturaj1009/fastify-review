export const getpostbyId = async (app, req, reply) => {
  try {
    const { id } = req.params;
    const collection = await app.mongo.db.collection("post");
    const data = await collection
      .find({ _id: new ObjectId(id) }, { projection: { password: 0 } })
      .toArray();
    if (data === null || data.length === 0 || data === undefined) {
      return reply.code(400).send({
        status: false,
        message: "No comments found",
      });
    }
    const rdata = data.reverse()[0];
    reply.send({
      status: true,
      res: rdata,
    });
  } catch (error) {
    console.log(error);
    reply.code(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export const getallpostbyId = async (app, req, reply) => {
  try {
    const { id } = req.params;
    const collection = await app.mongo.db.collection("post");
    const data = await collection
      .find({ _id: new ObjectId(id) }, { projection: { password: 0 } })
      .toArray();
    if (data === null || data.length === 0 || data === undefined) {
      return reply.code(400).send({
        status: false,
        message: "No comments found",
      });
    }
    const rdata = data.reverse();
    reply.send({
      status: true,
      res: rdata,
    });
  } catch (error) {
    console.log(error);
    reply.code(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export const addpostbyId = async (app, req, reply) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization.split(" ")[1];
    const loginId = await app.jwt.decode(token).data; 
    if(loginId===id){
        const userData = {
            userid: id,
            comment:"hello world",
          };
        const collection = await app.mongo.db.collection("post");
        const { insertedId } = await collection.insertOne(userData);
        if(insertedId){
            reply.send({
                status:true,
                comment:"added successfully"
            })
        }
        reply.code(400).send({
            status:false,
            comment:"Something went wrong"
        })
    }
    reply.code(400).send({
        status:false,
        comment:"Something went wrong"
    })
    
  } catch (error) {
    console.log(error);
    reply.code(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};
