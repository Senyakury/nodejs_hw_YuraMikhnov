import jwt from "jsonwebtoken";
import "dotenv/config"

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
if (!JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is not defined. Set it in the .env file.");
  }

export function authenticateToken(req, res, next) {
    const token = req.cookies['accessToken'];
    if (!token) {
      res.status(401).send('Access Denied');
      return;
    }
  
    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        res.status(403).send('Invalid Token');
        return;
      }
      req['id'] = payload.id;
      next();
    });
  }