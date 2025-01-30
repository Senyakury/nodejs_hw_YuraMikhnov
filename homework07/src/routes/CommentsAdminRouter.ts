import jwt from 'jsonwebtoken';
import { Router , Request , Response } from 'express';
import { authenticateToken , JWT_SECRET_KEY } from "../middleware/authentificator";
import { userService } from '../services/UserService';
import { postService } from '../services/PostService';
import { commentService } from '../services/CommentService';

export const CommentsAdminRoutes = Router()

CommentsAdminRoutes.get("/main/post/:postId/comments", async (req:Request , res:Response)=>{
    const token = req.cookies["accessToken"]
    const decoded = jwt.verify(token , JWT_SECRET_KEY) as {username:string}
    const name = decoded.username
    const id = req.params.postId
    const Me = await userService.getUserBy({name})
    const post = await postService.getPostBy({id})
    const user = await userService.getUserBy({id : post.authorId})
    const myComments = post.comments.filter(comment => comment.authorId == user.id)
    const authors = await userService.getAllUsers()
    const commentsWithAuthors = post.comments.map(comment => {
        const author = authors.find(author => author.id === comment.authorId);
        return {
            ...comment,
            authorName: author ? author.name : 'Unknown Author'
        };
    });
    res.render("postcomments",{
        post:{...post},
        myComments:myComments,
        comments:commentsWithAuthors,
        postcreator : user,
        me:Me
    })
})
CommentsAdminRoutes.post("/main/post/:postId/comments" , async (req:Request , res:Response)=>{
    const {content} = req.body
    const postId = req.params.postId
    const token = req.cookies["accessToken"]
    const decoded = jwt.verify(token , JWT_SECRET_KEY) as {username:string}
    const name = decoded.username
    const user = await userService.getUserBy({name})
    const authorId = user.id
    await commentService.createComment(content,authorId,postId)
    res.redirect(`/main/post/${postId}/comments`)
})
CommentsAdminRoutes.get("/main/post/:postId/comments/:commentId/delete",  async (req:Request, res:Response)=>{
    const { postId, commentId } = req.params;
    res.render("deletecomment",{
        postId:postId,
        commentId:commentId
    })
  })
CommentsAdminRoutes.post("/main/post/:postId/comments/:commentId/delete",  async (req:Request, res:Response)=>{
    const postId = req.params.postId
    const commentId = req.params.commentId
    await commentService.deleteComment(commentId)
    res.redirect(`/main/post/${postId}/comments`)
  })


  CommentsAdminRoutes.get("/main/post/:postId/comments/:commentId/change",  async (req:Request, res:Response)=>{
    const { postId, commentId } = req.params;
    res.render("updatecomment",{
        postId:postId,
        commentId:commentId
    })
  })
CommentsAdminRoutes.post("/main/post/:postId/comments/:commentId/change",  async (req:Request, res:Response)=>{
    const postId = req.params.postId
    const commentId = req.params.commentId
    const {content} = req.body
    const comment = await commentService.getCommentBy({id:commentId})
    const CheckedContent = content || comment.content
    await commentService.updateComment(commentId,CheckedContent)
    res.redirect(`/main/post/${postId}/comments`)
  })