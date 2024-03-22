import { ObjectId } from "@fastify/mongodb";
import { generateToken, matchpass, passhash } from "../helper/authHelper.js";
import {isAlpha,isAlphaNumeric,isNumeric} from "../helper/typeHelper.js"

export const getallUser = async (app, req, reply) => {
  try {
    const pagenum = Math.max(1, parseInt(req.query.page || 1));
    const elemsize = Math.max(4, parseInt(req.query.size || 4));
    const start = (pagenum - 1) * elemsize;
    const collection = await app.mongo.db.collection("user");
    const pagedata = await collection
      .find({}, { projection: { password: 0 } })
      .skip(start)
      .limit(elemsize)
      .toArray();
    const size = await Object.keys(pagedata).length;
    if (pagedata.length === 0) {
      reply.code(404).send({
        status: false,
        message: "No data found for this page",
      });
    } else {
      reply.send({
        status: true,
        size: size,
        message: pagedata,
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

export const getoneUser = async (app, req, reply) => {
  try {
    const { id } = req.params;
    const collection = await app.mongo.db.collection("user");
    const data = await collection.findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }
    );
    if (data === null || data === undefined) {
      return reply.code(400).send({
        status: false,
        message: "No data found",
      });
    }
    return reply.send({
      status: true,
      message: data,
    });
  } catch (error) {
    console.log(error);
    return reply.code(500).send({
      status: false,
      message: "Internal Server Error or Invalid Id",
    });
  }
};

export const addUser = async (app, req, reply) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password || !phone || !address) {
      return reply.code(400).send({
        status: false,
        message: "All fields are required",
      });
    }

    if (!isAlpha(name)) {
      return reply.status(400).send({
        status: false,
        message: "Provide a valid name containing only alphabets and spaces.",
        errors: ["Invalid name"],
      });
    }

    if (!isNumeric(phone) || phone.length !== 10) {
      return reply.status(400).send({
        status: false,
        message: "Provide a valid 10-digit phone number.",
        errors: ["Invalid phone number"],
      });
    }

    if (!isAlphaNumeric(password) || password.length < 5) {
      return reply.status(400).send({
        status: false,
        message: "Provide a miminum 5-digit alphanumeric password.",
        errors: ["Invalid password"],
      });
    }

    const collection = await app.mongo.db.collection("user");
    const user = await collection.findOne({ email });
    if (user) {
      return reply.code(404).send({
        status: false,
        message: "Email is Registered. Kindly Login...",
      });
    }
    const hashedPass = await passhash(password);
    const userData = {
      name: name,
      email: email,
      password: hashedPass,
      phone: phone,
      address: address,
      admin: false,
    };

    const { insertedId } = await collection.insertOne(userData);

    if (insertedId) {
      const token = await generateToken(app, insertedId);
      return reply.code(201).send({
        status: true,
        message: "Registered Successfully",
        token: token,
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

export const loginuser = async (app, req, reply) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return reply.code(400).send({
        status: false,
        message: "Email is required",
      });
    }
    if (!password) {
      return reply.code(400).send({
        status: false,
        message: "Password is required",
      });
    }
    const collection = await app.mongo.db.collection("user");
    const user = await collection.findOne({ email });
    if (!user) {
      return reply.code(404).send({
        status: false,
        message: "Email is not Registered",
      });
    }
    const matchpassword = await matchpass(password, user.password);
    if (!matchpassword) {
      return reply.code(404).send({
        status: false,
        message: "Enter correct password",
      });
    }
    // const data = {
    //   _id: user._id,
    //   name: user.name,
    //   email: user.email,
    //   phone: user.phone,
    //   address: user.address,
    // };
    const token = await generateToken(app, user._id);
    return reply.send({
      status: true,
      message: "Login successfully",
      // res: data,
      token: token,
    });
  } catch (error) {
    return reply.code(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteUser = async (app, req, reply) => {
  try {
    const userId = req.params.id; 
    const db = app.mongo.db;

    const deletionResult = await db.collection("user").deleteOne({ _id: ObjectId(userId) });

    if (deletionResult.deletedCount === 1) {
      const deleteReviewsResult = await deleteAllReviewsAndDecreaseStarCountByUser(db, userId);

      return reply.code(200).send({
        status: true,
        message: "User deleted successfully. " + deleteReviewsResult.message,
      });
    } else {
      return reply.status(404).send({
        status: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error(error);
    return reply.status(500).send({
      status: false,
      message: "Internal Server Error",
      error: error,
    });
  }
};

async function deleteAllReviewsAndDecreaseStarCountByUser(db, userId) {
  try {
    const deleteReviewsResult = await db.collection("review").deleteMany({ user_id: userId });
    const deletedReviews = deleteReviewsResult.deletedCount;
    const deletedReviewDocs = await db
      .collection("review")
      .find({ user_id: userId }, { projection: { _id: 1, star: 1, product_id: 1 } })
      .toArray();

    for (const review of deletedReviewDocs) {
      const { _id, star, product_id } = review;
      await db.collection("product").updateOne(
        { _id: ObjectId(product_id) },
        { $inc: { [`rating.${star}star`]: -1 } }
      );
    }

    return {
      status: true,
      message: `${deletedReviews} reviews by this user deleted successfully, and star counts decreased accordingly.`,
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      message: "Failed to delete reviews by this user and decrease star counts.",
      error: error,
    };
  }
}

export const setCookies = async (app, req, reply) => {
  try {
    const token = await generateToken(app,{"id":"1234"});
    reply.setCookie('token', token, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      // httpOnly: true,
      // secure: true,
    }).send({"message":"cookie set!!!!!"});
  } catch (error) {
    console.log(error);
  }
};

export const unsetCookies = async(app,req,reply)=>{
  try{
    reply.clearCookie('token').send({"message":"cookie deleted"});
  }
  catch(error){
    console.log(error);
  }
}