import { ObjectId } from "mongodb";
import { db } from "./DatabaseService.js";
import { userService } from "./UserService.js";

class PostService  {
    db;
    constructor(db){
      this.db = db
    }

    
  async getAllPosts(filters = {}) {
    return this.db.collection("posts").find(filters).toArray()
  }
  async getPostById(id) {
    return this.db.collection("posts").findOne({ _id: new ObjectId(id) });
  }
  async getPostByUserId(id) {
    const user = await userService.getUserById(id)
    if (user.posts.length == 0) {
      return "This User doesn't have any posts"
    }
    return await user.posts
  }
  async createPost({title, content, status}, authorId) {
      let author = await userService.getUserById(authorId) 
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
        const user = await userService.getUserById(postAuthor)
    
        const postIndex = user.posts.findIndex(post => post._id.toString() === updatedPost._id.toString());
        const updateResult = await this.db.collection("users").updateOne(
          { _id: new ObjectId(postAuthor) },
          { $set: { [`posts.${postIndex}`]: updatedPost } }
      );
        return result?.value;
      }
      async deletePost(id){
        const post = await this.getPostById(id)
    
        const user = await userService.getUserById(post.authorId)
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

export const postService = new PostService(db)