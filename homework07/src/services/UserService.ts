import { Repository } from "typeorm";
import { User } from "../models/User";
import { appDataSource } from "./appDataSource";


class UserService { 
  repository:Repository<User>
  constructor(){
    this.repository = appDataSource.getRepository(User);
  }
  async getAllUsers(filters?) {
    return await this.repository.find(filters)
  }

  

  async getUserBy(where:{}) {
    if (!where) {
      throw new Error("No data given");
    }
    const user = await this.repository.findOne({ where , relations : ["posts"]})
    return user
  }



  async createUser( name:string, email:string, passwordHash:string,age:number ) {
    const user = this.repository.create({
      name,
      email,
      password: passwordHash,
      age,
  });
    return await this.repository.save(user)
  }

  

 

  async updateUser(id:number, name?:string , email?:string ,passwordHash?:string, age?:number) {
    const user = await this.getUserBy({id})
    if (!user) {
      throw new Error("User Not Found");
    }
      user.name = name
      user.email = email
      user.password = passwordHash
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