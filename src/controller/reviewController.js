import { ObjectId } from "@fastify/mongodb";
import { isNumeric } from "../helper/typeHelper.js";

export const getreview = async (app, req, reply) => {
  try {
    const pagenum = Math.max(1, parseInt(req.query.page || 1));
    const elemsize = Math.max(3, parseInt(req.query.size || 3));
    const start = (pagenum - 1) * elemsize;
    const db = app.mongo.db;
    const pagedata = await db
      .collection("review")
      .find({}, { projection: { brand_id: 0 } })
      .skip(start)
      .limit(elemsize)
      .toArray();

    const size = pagedata.length;

    if (size === 0) {
      reply.code(404).send({
        status: false,
        message: "No Review found",
      });
    } else {
      const userIDs = pagedata.map((review) => new ObjectId(review.user_id));
      // console.log(userIDs);
      const productIDs = pagedata.map(
        (review) => new ObjectId(review.product_id)
      );

      const users = await db
        .collection("user")
        .find({ _id: { $in: userIDs } })
        .toArray();
      const userMap = {};
      users.forEach((user) => {
        userMap[user._id.toString()] = user.name;
      });

      const products = await db
        .collection("product")
        .find({ _id: { $in: productIDs } })
        .toArray();
      const productMap = {};
      products.forEach((product) => {
        productMap[product._id.toString()] = product.name;
      });

      // const modifiedData = pagedata.map((review) => ({
      //   ...review,
      //   user_name: userMap[review.user_id.toString()],
      //   product_name: productMap[review.product_id.toString()],
      //   user_id: undefined,
      //   product_id: undefined,
      // }));

      const modifiedData = [];
      pagedata.forEach((review) => {
        const user_name = userMap[review.user_id.toString()];
        const product_name = productMap[review.product_id.toString()];
        if (user_name && product_name) {
          modifiedData.push({
            ...review,
            user_name,
            product_name,
            user_id: undefined,
            product_id: undefined,
          });
        }
      });
      
      reply.code(200).send({
        status: true,
        page: pagenum,
        size: size,
        message: "Data fetched successfully",
        data: modifiedData,
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

export const getReviewbyid = async (app, req, reply) => {
  try {
    const pagenum = Math.max(1, parseInt(req.query.page || 1));
    const elemsize = Math.max(3, parseInt(req.query.size || 3));
    const start = (pagenum - 1) * elemsize;
    const db = app.mongo.db;

    const productID = req.params.id;

    const pagedata = await db
      .collection("review")
      .find({ product_id: productID, verified:true }, { projection: { verified: 0, brand_id: 0 } })
      .skip(start)
      .limit(elemsize)
      .toArray();

    const size = pagedata.length;

    if (size === 0) {
      const isValidProductId = await db
        .collection("product")
        .findOne({ _id: new ObjectId(productID) });

      if (!isValidProductId) {
        reply.code(404).send({
          status: false,
          message: "Product not found",
        });
      } else {
        reply.code(404).send({
          status: false,
          message: "No Reviews found for the product",
        });
      }
    } 
    else {
      const validReviews = pagedata.filter((review) => {
        return review.user_id && ObjectId.isValid(review.user_id); 
      });

      if (validReviews.length === 0) {
        return reply.code(404).send({
          status: false,
          message: "No Reviews found for the product",
        });
      }

      const userIDs = validReviews.map((review) => new ObjectId(review.user_id));

      const productIDs = validReviews.map((review) => new ObjectId(review.product_id));

      const users = await db
        .collection("user")
        .find({ _id: { $in: userIDs } },{projection:{email:0, password:0,phone:0,address:0,admin:0}})
        .toArray();
      // console.log(users);
      const userMap = {};
      users.forEach((user) => { 
        userMap[user._id.toString()] = user.name;
      });
      // console.log(userMap)

      const products = await db
        .collection("product")
        .find({ _id: { $in: productIDs } },{projection:{brand_id:0,url:0,price:0,discount_price:0,rating:0}})
        .toArray();
        // console.log(products)
      const productMap = {};
      products.forEach((product) => {
        productMap[product._id.toString()] = product.name;
      });

      const modifiedData = validReviews.map((review) => ({
        ...review,
        user_name: userMap[review.user_id.toString()],
        product_name: productMap[review.product_id.toString()],
        user_id: undefined,
        product_id: undefined,
      }));


      reply.send({
        status: true,
        page: pagenum,
        size: size,
        message: "Data fetched successfully",
        data: modifiedData,
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

export const addreviewbyId = async (app, req, reply) => {
  try {
    const { id } = req.params;
    const { star, comment } = req.body;

    if (!id || !comment || !star) {
      return reply.code(400).send({
        status: false,
        message: "All fields are required",
      });
    }

    if (!isNumeric(star) || star < 1 || star > 5) {
      return reply.status(400).send({
        status: false,
        message: "Provide a valid number between 1 to 5.",
        error: "Invalid number",
      });
    }

    const user_id = req.user.uid;
    const db = app.mongo.db;

    const product = await db
      .collection("product")
      .findOne({ _id: new ObjectId(id) });
    if (!product) {
      return reply.code(404).send({
        status: false,
        message: "Invalid product id.",
      });
    }

    const review = await db.collection("review").findOne({
      $and: [{ product_id: id }, { user_id }],
    });

    if (review) {
      return reply.code(400).send({
        status: false,
        message: "Already reviewed.",
      });
    }

    const userData = {
      user_id,
      product_id: id,
      star,
      comment,
      verified:false,
    };

    const { insertedId } = await db.collection("review").insertOne(userData);

    if (insertedId) {
      await db
        .collection("product")
        .updateOne(
          { _id: new ObjectId(id) },
          { $inc: { [`rating.${star}star`]: 1 } }
        );

      return reply.code(201).send({
        status: true,
        message: "Review is submitted for verification",
        res: {
          _id: insertedId,
          user_id: user_id,
          product_id: id,
          star: star,
          comment: comment,
        },
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

export const editreviewbyId = async (app, req, reply) => {
  try {
    const { id } = req.params;
    const { star, comment} = req.body;
    if (!star || !comment) {
      return reply.code(400).send({
        status: false,
        message: "All fields are required.",
      });
    }

    if (!isNumeric(star) || star < 1 || star > 5) {
      return reply.code(400).send({
        status: false,
        message: "Provide a valid number between 1 to 5 for 'star'.",
      });
    }

    const db = app.mongo.db;
    const prev = await db
      .collection("review")
      .findOne({ _id: new ObjectId(id) });

    if (!prev) {
      return reply.code(404).send({
        status: false,
        message: "Review not found",
      });
    }

    const res = await db
      .collection("review")
      .updateOne({ _id: new ObjectId(id) }, { $set: { star, comment,verified:true } });

    if (res.modifiedCount === 1) {
      const product_id = prev.product_id;
      const prevStar = prev.star;

      const updateObj = {};
      updateObj[`rating.${prevStar}star`] = -1;
      updateObj[`rating.${star}star`] = 1;

      await db
        .collection("product")
        .updateOne({ _id: new ObjectId(product_id) }, { $inc: updateObj });

      return reply.code(200).send({
        status: true,
        message: "Review updated successfully.",
        res: {
          _id: id,
          user_id: prev.user_id,
          product_id: prev.product_id,
          star,
          comment,
        },
      });
    } else {
      return reply.code(500).send({
        status: false,
        message: "Nothing to update or something went wrong...",
      });
    }
  } catch (error) {
    console.error(error);
    return reply.code(500).send({
      status: false,
      message: "Internal server error.",
      error: error,
    });
  }
};

export const deletereviewbyId = async (app, req, reply) => {
  try {
    const { id } = req.params;

    const db = app.mongo.db;
    const review = await db
      .collection("review")
      .findOne({ _id: new ObjectId(id) });

    if (!review) {
      return reply.code(404).send({
        status: false,
        message: "Review not found",
      });
    }

    const product_id = review.product_id;
    const prevStar = review.star;

    const res = await db
      .collection("review")
      .deleteOne({ _id: new ObjectId(id) });

    if (res.deletedCount === 1) {
      const updateObj = {};
      updateObj[`rating.${prevStar}star`] = -1;

      await db
        .collection("product")
        .updateOne({ _id: new ObjectId(product_id) }, { $inc: updateObj });

      return reply.code(200).send({
        status: true,
        message: "Review deleted successfully.",
        deletedReview: {
          _id: id,
          user_id: review.user_id,
          product_id: review.product_id,
          star: review.star,
          comment: review.comment,
        },
      });
    } else {
      return reply.code(500).send({
        status: false,
        message: "Failed to delete review or review not found.",
      });
    }
  } catch (error) {
    console.error(error);
    return reply.code(500).send({
      status: false,
      message: "Internal server error.",
      error: error,
    });
  }
};
