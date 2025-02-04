import { Comment } from './../models/Comment';
import { DataSource } from "typeorm"
import { User } from "../models/User"
import { Post } from "../models/Post"
import "dotenv/config"
export const appDataSource = new DataSource({
    type:"postgres",
    host:"0.0.0.0",
    port:5432,
    url:process.env.DB_URL,
    synchronize:true,
    logging:true,
    entities:[User,Post,Comment],
    subscribers:[],
    migrations:[]
})