import { DataSource } from "typeorm"
import { User } from "../models/User.ts"
import { Post } from "../models/Post.ts"
import "dotenv/config"
export const appDataSource = new DataSource({
    type:"postgres",
    host:"localhost",
    port:4000,
    url:process.env.DB_URL,
    synchronize:true,
    logging:true,
    entities:[User,Post],
    subscribers:[],
    migrations:[]
})