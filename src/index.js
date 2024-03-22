import fastify from "fastify";
import fastifyMongo from "@fastify/mongodb";
import cors from '@fastify/cors';
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import {config} from "dotenv";
import { dbconn } from "./config/db.js";
import { jwtsecret } from "./config/jwt.js";
import { cookiesecret } from "./config/cookie.js";
import { isAdmin, isRegistered } from "./middleware/authMiddleware.js";
import { userRoutes } from "./routes/userRoutes.js";
import { postRoutes } from "./routes/postRoutes.js";
import { productRoutes } from "./routes/productRoutes.js";
import { reviewRoutes } from "./routes/reviewRoutes.js";
import { noRoute } from "./middleware/errorMiddleware.js";


const app = fastify();
config();

//db connection
app.register(fastifyMongo, dbconn);

//jwt connection
app.register(fastifyJwt,jwtsecret);


//Middleware
await app.register(cors);
// app.decorate("authenticate",isRegistered);


//cookie connection
app.register(fastifyCookie,cookiesecret);

//routes
app.setNotFoundHandler(noRoute);
app.register(userRoutes,{prefix:'/api/v1/user'});
app.register(postRoutes,{prefix:'/api/v1/'});
app.register(productRoutes,{prefix:'/api/v1/'});
app.register(reviewRoutes,{prefix:'/api/v1/review'});


app.get("/",async(req,reply)=>{
    reply.send({
      "message" : `Server is listening`
    })
})


app.ready(async (err) => {
  if (err) throw err;
  console.log('No Error');
});


app.listen({ port: process.env.PORT }, (err) => {
  if (err) throw err;
  console.log(`Server listening on on ${process.env.MY_URL}${process.env.PORT}`);
});