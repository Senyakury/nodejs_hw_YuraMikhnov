import { Repository } from "typeorm";
import { Post } from "../models/Post";
import { User } from "../models/User";
import { appDataSource } from "./appDataSource";
import { userService } from "./UserService";

class PostService  {
    userRepository : Repository<User>
    repository: Repository<Post>
    constructor(){
      this.repository = appDataSource.getRepository(Post)
      this.userRepository = appDataSource.getRepository(User)
    }

    
  async getAllPosts(filters) {
    return await this.repository.find(filters)
  }
  async getPostById(id:number) {
    const post = await this.repository.findOne({ where: { id } })
    return post
  }
  async getPostByUserId(id:number) {
    const user = await userService.getUserById(id)
    if (!user) {
      throw new Error("User Not Found");
    }
    if (user.posts.length == 0) {
      return "This User doesn't have any posts"
    }
    return user.posts
  }
  async createPost({title, content, status}, authorId:number) {
      let post = await new Post
      post.title = title 
      post.content = content
      post.status = status
      post.authorId = authorId
      post.createdAt = new Date().toISOString()
      post.updatedAt = new Date().toISOString()
      await this.repository.save(post);

      const author = await userService.getUserById(authorId);
      if (!author) {
        throw new Error("Author Not Found!");
      }
      if (!author.posts) {
        author.posts = [post]
        await this.userRepository.save(author)
      }
        return post
    }
     async updatePost(id:number, title:string, content:string , status:string  ) {
        const post = await this.getPostById(id)
        if (!post) {
          throw new Error("Post not Found")
        }
          post.title = title
          post.content = content
          post.status = status
        return await this.repository.save(post)
      }
      async deletePost(id:number){
        const deleted = await this.repository.delete(id)
        if (deleted.affected === 0) {
          throw new Error("Post Not Found");
        }
        return deleted
      }
    }

export const postService = new PostService()