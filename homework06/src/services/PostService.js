import { Post } from "../models/Post.ts";
import { User } from "../models/User.ts";
import { appDataSource } from "./appDataSource.js";
import { userService } from "./UserService.js";

class PostService  {
  userRepository
    repository;
    constructor(){
      this.repository = appDataSource.getRepository(Post)
      this.userRepository = appDataSource.getRepository(User)
    }

    
  async getAllPosts(filters) {
    return await this.repository.find(filters)
  }
  async getPostById(id) {
    const post = await this.repository.findOne({ where: { id } ,  relations: ["posts"],})
    if (!post) {
      throw new Error("Post Not Found");
    }
    return post
  }
  async getPostByUserId(id) {
    const user = await userService.getUserById(id)
    if (!user) {
      throw new Error("User Not Found");
    }
    if (user.posts.length == 0) {
      return "This User doesn't have any posts"
    }
    return user.posts
  }
  async createPost({title, content, status}, authorId) {
    const author = await userService.getUserById(authorId);
    if (!author) {
      throw new Error("Author Not Found!");
    }
      let post = new Post
      if (typeof(title) == "string" && title) {
        post.title = title
      }else{throw new Error("Title either not given or its  expected to be string")}
      if (typeof(content) == "string" && content) {
        post.content = content
      }else{throw new Error("Content either not given or its expected to be string")}
      if (typeof(status) == "string"&& status) {
        post.status = status
      }else{throw new Error("Status either not given or its expected to be string")}

      post.authorId = authorId
      post.createdAt = new Date().toISOString()
      post.updatedAt = new Date().toISOString()
      await this.repository.save(post);

      await userService.AddPostToUser(post)
      return post
    }
     async updatePost(id, title, content, status  ) {
        const post = await this.getPostById(id)
        if (!post) {
          throw new Error("Post not Found")
        }

        if (title && typeof(title) == "string") {
          post.title = title
        }else if(typeof(title) !== "string"){throw new Error("Title expected to be string");}

        if (content && typeof(content) == "string") {
          post.content = content
        }else if(typeof(content) !== "string"){throw new Error("Content expected to be string");}

        if (status && typeof(status) == "string") {
          post.status = status
        }else if(typeof(status) !== "string"){throw new Error("Status expected to be string");}

        return await this.repository.save(post)
      }
      async deletePost(id){
        const post = await this.getPostById(id)
        if (!post) {
          throw new Error("Post not found");
        }
        const authorId = post.authorId
        const author = await userService.getUserById(authorId)
        for (let i = 0; i < author.posts.length; i++) {
          if (author.posts[i].id == id) {
            author.posts[i].status = "deleted"
            await this.userRepository.save(author)
          }
        }
        const deleted = await this.repository.delete(id)
        if (deleted.affected === 0) {
          throw new Error("Post Not Found");
        }
        return deleted
      }
    }

export const postService = new PostService()