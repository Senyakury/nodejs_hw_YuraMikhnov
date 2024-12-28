import { ObjectId } from "mongodb";
import { db } from "./DatabaseService.js";

class UserService { 
  db;
  constructor(db){
    this.db = db
  }
  async getAllUsers(filters) {
    try {
      const result = await this.db.collection("users").find(filters).toArray() ;
      if (result.length === 0) {
      }
      return result;
  } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
  }
  }
  async getAllPosts(filters = {}) {
    return this.db.collection("posts").find(filters).toArray()
  }
  

  async getUserById(id) {
    return this.db.collection("users").findOne({ _id: new ObjectId(id) });
  }
  async getPostById(id) {
    return this.db.collection("posts").findOne({ _id: new ObjectId(id) });
  }
  async getPostByUserId(id) {
    const user = await this.getUserById(id)
    if (user.posts.length == 0) {
      return "This User doesn't have any posts"
    }
    return await user.posts
  }

  async createUser( name, email, age ) {
    const result = await this.db.collection("users").insertOne({name,email,age});
    return { _id: result.insertedId, name, email, age };
  }

  async createPost({title, content, status}, authorId) {
    let author = await this.getUserById(authorId) 
    if (!author) {
      throw new Error("Author Not Found!")
    }
    const post = {
      title,
      content,
      status,
      authorId: new ObjectId(authorId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
  };

    const result = await this.db.collection("posts").insertOne(post);
    const Post = await this.getPostById(result.insertedId)
    await this.db.collection("users").updateOne(
      { _id: new ObjectId(authorId) },
      { $push: { posts: Post } }
  );
  return {
    ...post,
    _id: result.insertedId,
};
  }

  async updatePost(id, title, content, status  ) {
    const post = await this.getPostById(id)
    const authorId = await post.authorId
    const result = await this.db.collection("posts").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: {title:title, content:content, status:status,authorId:authorId, updatedAt: new Date().toISOString() }},
      { returnDocument: "after" }
    );
    let updatedPost = await this.getPostById(id)
    const postAuthor = await updatedPost.authorId
    const user = await this.getUserById(postAuthor)

    const postIndex = user.posts.findIndex(post => post._id.toString() === updatedPost._id.toString());
    const updateResult = await this.db.collection("users").updateOne(
      { _id: new ObjectId(postAuthor) },
      { $set: { [`posts.${postIndex}`]: updatedPost } }
  );
    return result?.value;
  }

  async updateUser(id, name , email , age ) {
    const UserPosts = await this.getAllPosts()
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
    // await this.db.collection("posts").deleteMany({ authorId: new ObjectId(id) });
    const user = await this.getUserById(id)
 
    if (user.posts.length > 0) {
      user.posts.forEach(el => {
        this.db.collection("posts").deleteOne({ _id: new ObjectId(el._id) })
      });
    }
    const result = await this.db.collection("users").deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
  async deletePost(id){
    const post = await this.getPostById(id)

    const user = await this.getUserById(post.authorId)
    let result;
    if (user.posts.length == 0) {
      result = await this.db.collection("posts").deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount
    }else if(user.posts.length == 1){
      const userUpd = await this.db.collection("users").findOneAndUpdate(
        { _id: new ObjectId(post.authorId) },
        { $set : {posts : []}}
    );
    result = await this.db.collection("posts").deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0 && userUpd.value !== null;

    }else if(user.posts.length >= 2){
      const FiltredPosts = user.posts.filter(post => post._id.toString() !== id)
      const userUpd = await this.db.collection("users").findOneAndUpdate(
        { _id: new ObjectId(post.authorId) },
        { $set : {posts : FiltredPosts}}
    );
    result = await this.db.collection("posts").deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0 && userUpd.value !== null;
    }else{
      return false
    }
  }
}

export const userService = new UserService(db);