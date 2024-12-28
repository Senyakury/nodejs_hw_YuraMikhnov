import { MongoClient, Db } from "mongodb";
import "dotenv/config"
import logger from "../app/utils/logger.js";


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
          await log("Connected to DB")
          return this.client.db(process.env.DB_NAME);
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


const URL = process.env.DB_URL;

export const databaseService = new DatabaseService(URL);
export const db = await databaseService.connect();