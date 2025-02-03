import { MongoClient, Db } from "mongodb";
import "dotenv/config"
import logger from "../app/utils/logger.js";
const URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME

const {log , warn} = logger("main")
class DatabaseService {
    url;
    client;
    constructor(url){
      this.url = url
        this.client = new MongoClient(this.url)
    }
    async connect(){
      try{
          await this.client.connect()
          log("Connected to DB")
          return this.client.db(DB_NAME);
      }catch(error){
          throw error
      }
  }
    async disconnect(){
        try {
          await this.client.close();
          log("Disconnected from MongoDB");
        } catch (error) {
          warn("Failed to disconnect from MongoDB", error);
        }
      }
}




export const databaseService = new DatabaseService(URL);
export const db = await databaseService.connect();