import { Repository } from "typeorm";
import { appDataSource } from "./appDataSource";
import { Comment } from "../models/Comment";


class CommentService { 
  repository:Repository<Comment>
  constructor(){
    this.repository = appDataSource.getRepository(Comment);
  }
  async getAllComments(filters?) {
    return await this.repository.find(filters)
  }

  

  async getCommentBy(where:{}) {
    if (!where) {
      throw new Error("No data given");
    }
    const comment = await this.repository.findOne({ where })
    return comment
  }



  async createComment( content:string, authorId:number, postId:number) {
    const comment = this.repository.create({
        content,
        authorId,
        postId
  });
    return await this.repository.save(comment)
  }

  

 

  async updateComment(id:number, content?:string) {
    const comment = await this.getCommentBy({id})
    if (!comment) {
      throw new Error("User Not Found");
    }
      comment.content = content
    return await this.repository.save(comment)
  }


  async deleteComment(id:number) {
    const deleted = await this.repository.delete(id)
    if (deleted.affected === 0) {
      throw new Error("User Not Found");
    }
    return deleted
  }
  
}

export const commentService = new CommentService();