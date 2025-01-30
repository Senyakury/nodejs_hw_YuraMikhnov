import { Router , Request , Response } from 'express';
import jwt from 'jsonwebtoken';
import { postService } from '../services/PostService';
import { userService } from '../services/UserService';

export const PostsAdminRouter = Router()
PostsAdminRouter.get("/main/postcreate", async (req:Request , res:Response)=>{
    res.render("postcreate")
})
PostsAdminRouter.post("/main/postcreate", async (req:Request , res:Response)=>{
    try {
        const token = req.cookies['accessToken'];
        if (!token) {
            return res.status(401).send('No token found');
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY ) as { username: string };
        const name = verified.username
        const author = await userService.getUserBy({ name });
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
PostsAdminRouter.post("/main/postchange/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    const { title, content } = req.body;
    
    // Перевірка на наявність поста
    const post = await postService.getPostBy({ id:id });
    if (!post) {
        return res.status(400).send("Post not found");
    }

    // Оновлення поста
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