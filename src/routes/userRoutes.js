import { getallUser, getoneUser, addUser, loginuser, setCookies, unsetCookies } from "../controller/userController.js";
import { isAdmin, isRegistered } from "../middleware/authMiddleware.js";
import { loginSchema, registerSchema } from "../schema/authSchema.js";

export const userRoutes = async (app) => {
  // User routes
  app.post("/register", { schema: registerSchema }, (req, reply) => addUser(app, req, reply));
  app.post("/login", { schema: loginSchema }, (req, reply) => loginuser(app, req, reply));
  app.get("/:id", { onRequest: isRegistered }, (req, reply) => getoneUser(app, req, reply));
  app.delete("/delete/:id", (req, reply) => deleteUser(app, req, reply));
  app.patch("/edit/:id", (req, reply) => updateUser(app, req, reply));

  // Admin route with admincheck middleware
  app.get("/getall", { onRequest: [isRegistered, isAdmin(app)] }, (req, reply) => getallUser(app, req, reply));

  app.get("/set-cookie", (req, reply) => setCookies(app, req, reply));
  app.get("/unset-cookie", (req, reply) => unsetCookies(app, req, reply));
};
