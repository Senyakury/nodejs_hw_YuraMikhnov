import { Router , Request , Response } from 'express';
import { authenticateToken , JWT_SECRET_KEY } from "../middleware/authentificator";
import { userService } from '../services/UserService';
import { postService } from '../services/PostService';
import { commentService } from '../services/CommentService';
import { body, validationResult } from 'express-validator';
export const CommentsAdminRoutes = Router()

CommentsAdminRoutes.get("/main/post/:postId/comments",authenticateToken, async (req:Request , res:Response)=>{
    const user = req.user
    const id = req.params.postId
    const post = await postService.getPostBy({id})
    const authorOfPost = await userService.getUserBy({id : post.authorId})
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
        postcreator : authorOfPost,
        me:user
    })
})
CommentsAdminRoutes.post("/main/post/:postId/comments",authenticateToken
    ,body("content").isLength({min:2})
    ,async (req:Request , res:Response)=>{

    const result = validationResult(req)
    if (!result.isEmpty()) {
          res.status(422).send({ errors: result.array() });
          return;
    }

    const {content} = req.body
    const postId = req.params.postId
    const author = req.user
    const authorId = author.id
    await commentService.createComment(content,authorId,postId)
    res.redirect(`/main/post/${postId}/comments`)
})
CommentsAdminRoutes.get("/main/post/:postId/comments/:commentId/delete", authenticateToken , async (req:Request, res:Response)=>{
    const { postId, commentId } = req.params;
    res.render("deletecomment",{
        postId:postId,
        commentId:commentId
    })
  })
CommentsAdminRoutes.post("/main/post/:postId/comments/:commentId/delete", authenticateToken , async (req:Request, res:Response)=>{
    const postId = req.params.postId
    const commentId = req.params.commentId
    const comment = await commentService.getCommentBy({id:commentId})
    const user = req.user
    if (user.id !== comment.authorId) {
        return res.status(403).send("You are not an author")
    }
    await commentService.deleteComment(commentId)
    res.redirect(`/main/post/${postId}/comments`)
  })


  CommentsAdminRoutes.get("/main/post/:postId/comments/:commentId/change", authenticateToken ,  async (req:Request, res:Response)=>{
    const { postId, commentId } = req.params;
    res.render("updatecomment",{
        postId:postId,
        commentId:commentId
    })
  })
CommentsAdminRoutes.post("/main/post/:postId/comments/:commentId/change", authenticateToken ,  async (req:Request, res:Response)=>{
    const postId = req.params.postId
    const commentId = req.params.commentId
    const {content} = req.body
    const comment = await commentService.getCommentBy({id:commentId})
    const user = req.user
    if (user.id !== comment.authorId) {
        res.status(403).send("You are not an author")
    }
    const CheckedContent = content || comment.content
    await commentService.updateComment(commentId,CheckedContent)
    res.redirect(`/main/post/${postId}/comments`)
  })