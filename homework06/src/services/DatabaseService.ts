import logger from "../app/utils/logger";
import { appDataSource } from "./appDataSource";

const {log , warn} = logger("main")
class DatabaseService {
  async connect(){
    try {
      await appDataSource.initialize();
      log("Connected to PostgreSQL");
      return appDataSource;
    } catch (error) {
      warn("Failed to connect to PostgreSQL", error);
      throw error;
    }
  }

  async disconnect(){
    try {
      await appDataSource.destroy();
      log("Disconnected from PostgreSQL");
    } catch (error) {
      warn("Failed to disconnect from PostgreSQL", error);
    }
  }
}




export const databaseService = new DatabaseService();
export const db = await databaseService.connect();