import { getallProducts,getsingleProduct,getbrandProduct } from "../controller/productController.js";
export const productRoutes = async (app)=>{
    //all products
    app.get("/allproducts",(req,reply)=>getallProducts(app,req,reply));
    //products by brand
    app.get("/brandproduct/:id",(req,reply)=>getbrandProduct(app,req,reply));
    //product by id
    app.get("/product/:id",(req,reply)=>getsingleProduct(app,req,reply));

    app.post("/addproduct",(req,reply)=>addsingleProduct(app,req,reply));
}