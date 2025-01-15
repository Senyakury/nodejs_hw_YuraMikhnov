import { Repository } from "typeorm";
import { User } from "../models/User";
import { appDataSource } from "./appDataSource";


class UserService { 
  repository:Repository<User>
  constructor(){
    this.repository = appDataSource.getRepository(User);
  }
  async getAllUsers(filters) {
    return await this.repository.find(filters)
  }

  

  async getUserById(id:number) {
    if (!id) {
      throw new Error("No Id given");
    }
    const user = await this.repository.findOne({ where: { id } , relations : ["posts"]})
    if (!user) {
      throw new Error("User Not Found");
    }
    return user
  }



  async createUser( name:string, email:string, age:number ) {
    const user = new User
      user.name = name
      user.email = email
      user.age = age
    return await this.repository.save(user)
  }

  

 

  async updateUser(id:number, name:string , email:string , age:number) {
    const user = await this.getUserById(id)
    if (!user) {
      throw new Error("User Not Found");
    }
      user.name = name
      user.email = email
      user.age = age
    return await this.repository.save(user)
  }


  async deleteUser(id:number) {
    const deleted = await this.repository.delete(id)
    if (deleted.affected === 0) {
      throw new Error("User Not Found");
    }
    return deleted
  }
  
}

export const userService = new UserService();