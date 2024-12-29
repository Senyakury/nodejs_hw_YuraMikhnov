import { Router } from "express";
import { postService } from "../src/PostService.js";

const postRouter = Router();

postRouter.get("/users/:id/posts", async (req, res) => {
    const { id } = req.params;
    try {
      const user = await postService.getPostByUserId( id );

      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  postRouter.post("/posts", async (req, res) => {
    const { title , content , status , authorId} = req.body;
    try {
      const user = await postService.createPost({ title , content , status} , authorId);
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  postRouter.get("/posts", async (req, res) => {
    try {
      const users = await postService.getAllPosts(req.query);
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  postRouter.get("/posts/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const user = await postService.getPostById(id);
      if (!user) {
        res.status(404).json({ error: "Post not found" });
        return;
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  postRouter.put("/posts/:id", async (req, res) => {
    const { id } = req.params;
    const { title , content , status} = req.body;
    try {
      const user = await postService.updatePost(id , title , content , status );
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  postRouter.delete("/posts/:id", async (req , res) => {
    const { id } = req.params;
    try {
      const message = await postService.deletePost(id);
      res.json(message);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  export default postRouter;