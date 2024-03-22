import { addreviewbyId, deletereviewbyId, editreviewbyId, getReviewbyid, getreview } from "../controller/reviewController.js";
import { isRegistered,isAdmin } from "../middleware/authMiddleware.js";
import { allreviewSchema, deletereviewSchema, reviewSchema } from "../schema/reviewSchema.js";


export const reviewRoutes = async(app)=>{
    //user Routes
    //add review
    app.post("/add/:id",{ schema:reviewSchema , onRequest: isRegistered },(req,reply)=>addreviewbyId(app,req,reply));
    //review by productID
    app.get("/:id",(req,reply)=>getReviewbyid(app,req,reply));
    


    //admin routes
    //all review 
    app.get("/",{onRequest:[isRegistered,isAdmin(app)]},(req,reply)=>getreview(app,req,reply));
    //edit review
    app.patch("/edit/:id",{ schema:reviewSchema , onRequest: [isRegistered,isAdmin(app)] },(req,reply)=>editreviewbyId(app,req,reply));
    //delete review
    app.delete("/delete/:id",{ schema:deletereviewSchema, onRequest: [isRegistered,isAdmin(app)] },(req,reply)=>deletereviewbyId(app,req,reply));
}

