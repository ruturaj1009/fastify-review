import { config } from "dotenv";
config();
export const cookiesecret = {
    secret: process.env.COOKIE_SECRET, // Required, used for cookie signing
    parseOptions: {}, // Optional, options for the cookie parsing library (cookie package)
    setOptions: {
      path: '/',            // Optional, cookie path
      // domain: 'example.com',// Optional, cookie domain
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Optional, cookie expiration in milliseconds
      secure: true,         // Optional, set to true if using HTTPS
      httpOnly: true,       // Optional, cookie is only accessible through HTTP(S) headers
      sameSite: 'Strict'    // Optional, strict same-site policy
    },
    sendOptions: {} // Optional, options for the cookie sending library (fastify-cookie package)
  }