import { config } from "dotenv";
config();

export const dbconn = {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/test',
    forceClose: true
};