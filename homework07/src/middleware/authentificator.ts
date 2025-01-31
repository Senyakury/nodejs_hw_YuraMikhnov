import { userService } from './../services/UserService';
import jwt from "jsonwebtoken";
import "dotenv/config"
import logger from '../app/utils/logger';

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
if (!JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is not defined. Set it in the .env file.");
  }

export const authenticateToken = async (req, res, next) => {
    const token = req.cookies['accessToken'];
    if (!token) {
      res.status(401).send('Access Denied');
      return;
    }
  
    const decoded = jwt.verify(token, JWT_SECRET_KEY) as {email:string};
    logger("main").log(decoded.email)
    const email = decoded.email
    const user = await userService.getUserBy({email})
    req.user = user;
    next();
    return user
  }