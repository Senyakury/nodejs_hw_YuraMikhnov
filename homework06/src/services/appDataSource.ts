import { DataSource } from "typeorm"
import { User } from "../models/User"
import { Post } from "../models/Post"
import "dotenv/config"
export const appDataSource = new DataSource({
    type:"postgres",
    host:"db",
    port:5432,
    url:process.env.DB_URL,
    synchronize:true,
    logging:true,
    entities:[User,Post],
    subscribers:[],
    migrations:[]
})