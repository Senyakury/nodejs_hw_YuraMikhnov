import { User } from "../models/User.ts";
import { appDataSource } from "./appDataSource.js";
import { postService } from "./PostService.js";


class UserService { 
  repository
  constructor(){
    this.repository = appDataSource.getRepository(User);
  }
  async getAllUsers(filters) {
    return await this.repository.find(filters)
  }

  

  async getUserById(id) {
    if (!id) {
      throw new Error("No Id given");
    }
    const user = await this.repository.findOne({ where: { id } })
    if (!user) {
      throw new Error("User Not Found");
    }
    return user
  }



  async createUser( name, email, age ) {
    const user = new User
    if (typeof(name) == "string" && name) {
      user.name = name
    }else{throw new Error("Name either not given or its not a string");}
    if (typeof(email) == "string" && email) {
      user.email = email
    }else{throw new Error("Email either not given or its not a string");}
    if (age) {
      user.age = age
    }else{throw new Error(`Age either not given or its not a number , age = ${age}`);}
    user.posts = []
    return await this.repository.save(user)
  }
  async AddPostToUser (post){
    const user = await this.getUserById(post.authorId);
    if (!user.posts) {
      user.posts = [post]
    }else{
      user.posts.push(post)
    }
    return await this.repository.save(user);
  }

  

 

  async updateUser(id, name , email , age, post ) {
    const user = await this.getUserById(id)
    if (!user) {
      throw new Error("User Not Found");
    }
    if (name && typeof(name) == "string") {
      user.name = name
    }else if(typeof(name) !== "string"){
      throw new Error("Name expected to be String");
    }
    if (email && typeof(email) == "string") {
      user.email = email
    }else if(typeof(email) !== "string"){
      throw new Error("Email expected to be String");
    }
    if (age && typeof(age) == "number") {
      user.age = age
    }else if(typeof(age) !== "number"){
      throw new Error("Age expected to be Number"); 
    }
    // user.posts = []
    // user.posts.push(post)
    return await this.repository.save(user)
  }


  async deleteUser(id) {
    const user = await this.getUserById(id)
    if (user.posts) {
      for (let i = 0; i < user.posts.length; i++) {
        await postService.deletePost(user.posts[i].id)
      }
    }
    const deleted = await this.repository.delete(id)
    if (deleted.affected === 0) {
      throw new Error("User Not Found");
    }
    return deleted
  }
  
}

export const userService = new UserService();