import fastify from "fastify";
import fastifyMongo from "@fastify/mongodb";
import cors from '@fastify/cors';
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { config } from "dotenv";
import { dbconn } from "./config/db.js";
import { jwtsecret } from "./config/jwt.js";
import { cookiesecret } from "./config/cookie.js";
import { userRoutes } from "./routes/userRoutes.js";
import { postRoutes } from "./routes/postRoutes.js";
import { productRoutes } from "./routes/productRoutes.js";
import { reviewRoutes } from "./routes/reviewRoutes.js";
import { noRoute } from "./middleware/errorMiddleware.js";

const app = fastify();
config();

// Register MongoDB
app.register(fastifyMongo, dbconn);

// Register JWT
app.register(fastifyJwt, jwtsecret);

// Middleware
app.register(cors);

// Register Cookies
app.register(fastifyCookie, cookiesecret);

// Routes
app.setNotFoundHandler(noRoute);
app.register(userRoutes, { prefix: '/api/v1/user' });
app.register(postRoutes, { prefix: '/api/v1/post' });
app.register(productRoutes, { prefix: '/api/v1/product' });
app.register(reviewRoutes, { prefix: '/api/v1/review' });

app.get("/", async (req, reply) => {
  reply.send({
    "message": `Server is listening`
  });
});

const start = async () => {
  try {
    await app.listen({ port: process.env.PORT });
    console.log(`Server listening on ${process.env.MY_URL}${process.env.PORT}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

start();
