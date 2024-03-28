import { getallProducts,getsingleProduct,getbrandProduct,addsingleProduct } from "../controller/productController.js";
import { isRegistered, isAdmin } from "../middleware/authMiddleware.js";
import { addproductSchema } from "../schema/productSchema.js";

export const productRoutes = async (app)=>{
    //all products
    app.get("/getall",(req,reply)=>getallProducts(app,req,reply));
    //products by brand
    app.get("/bid/:id",(req,reply)=>getbrandProduct(app,req,reply));
    //product by id
    app.get("/:id",(req,reply)=>getsingleProduct(app,req,reply));

    //add product
    app.post("/add",{schema:addproductSchema , onRequest:[isRegistered,isAdmin(app)]},(req,reply)=>addsingleProduct(app,req,reply));
}