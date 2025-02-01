import { Router , Request , Response } from 'express';
import { postService } from '../services/PostService';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/authentificator';


export const PostsAdminRouter = Router()
PostsAdminRouter.get("/main/postcreate", async (req:Request , res:Response)=>{
    res.render("postcreate")
})
PostsAdminRouter.post("/main/postcreate",authenticateToken,
    body("title").isLength({min:2 , max:20}),
    body("content").isLength({min:5 , max:100}),
     async (req:Request , res:Response)=>{
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
              res.status(422).send({ errors: result.array() });
              return;
        }

        const author = req.user
        if (!author) {
            return res.status(404).send('Author not found');
        }
        const { title, content } = req.body
        const post = await postService.createPost({
            title,
            content,
            status: "created",
        }, author.id);
        res.redirect('/main');

    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).send('Internal Server Error');
    }
})
PostsAdminRouter.get('/main/postchange/:id', async (req:Request, res:Response) => {
    const postId = req.params.id;
    res.render("postchange", { id: postId });
});
PostsAdminRouter.post("/main/postchange/:id",
    body("title").isLength({min:2 , max:20}),
    body("content").isLength({min:5 , max:100})
    , async (req: Request, res: Response) => {
        const result = validationResult(req)
        if (!result.isEmpty()) {
              res.status(422).send({ errors: result.array() });
              return;
        }

    const id = req.params.id;
    const { title, content } = req.body;
    const post = await postService.getPostBy({ id:id });
    if (!post) {
        return res.status(400).send("Post not found");
    }
    await postService.updatePost(id, title, content);
    res.redirect('/main');
});
PostsAdminRouter.get('/main/postdelete/:id', async (req:Request, res:Response) => {
    const postId = req.params.id;
    res.render("postdelete", {id:postId})
});
PostsAdminRouter.post("/main/postdelete/:id", async (req:Request , res:Response)=>{
    const id = req.params.id;
    await postService.deletePost(id)
    res.redirect("/main")
})