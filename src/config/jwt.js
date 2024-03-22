import { config } from "dotenv";
config();
export const jwtsecret = {
    secret : process.env.JWT_SECRET
}