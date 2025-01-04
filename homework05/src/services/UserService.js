import { ObjectId } from "mongodb";
import { db } from "./DatabaseService.js";
import { postService } from "./PostService.js"

class UserService { 
  db;
  constructor(db){
    this.db = db
  }
  async getAllUsers(filters) {
    try {
      const result = await this.db.collection("users").find(filters).toArray() ;
      return result;
  } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
  }
  }

  

  async getUserById(id) {
    return this.db.collection("users").findOne({ _id: new ObjectId(id) });
  }



  async createUser( name, email, age ) {
    const result = await this.db.collection("users").insertOne({name,email,age});
    return { _id: result.insertedId, name, email, age };
  }

  

 

  async updateUser(id, name , email , age ) {
    const UserPosts = await postService.getAllPosts()
    // const ownPosts = []
    const user = await this.getUserById(id)
    const ownPosts = UserPosts.filter(post => post.authorId.toString() === user._id.toString());

    const result = await this.db.collection("users").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: {name,email,age, posts:ownPosts}},
      { returnDocument: "after" }
    );
    return result?.value;
  }

  async deleteUser(id) {
    const user = await this.getUserById(id)
    if (user.posts) {
      if ( user.posts.length > 0) {
        this.db.collection("posts").deleteMany({ authorId: id })
        const result = await this.db.collection("users").deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
      }else{
        const result = await this.db.collection("users").deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
      }
    }
    else{
      const result = await this.db.collection("users").deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    }

  }
  
}

export const userService = new UserService(db);