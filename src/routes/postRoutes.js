import { addpostbyId } from "../controller/postController.js";

export const postRoutes = async(app)=>{
    app.post("/addpost/:id",{ preHandler: app.authenticate },(req,reply)=>addpostbyId(app,req,reply));
    app.get("/posts/:id",(req,reply)=>getpostsbyId(app,req,reply));
}