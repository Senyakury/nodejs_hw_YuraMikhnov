import { Router } from "express";
import { postService } from "../services/PostService.js";
import { body, validationResult } from "express-validator"

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

  postRouter.post("/posts",
    body("title").trim().isLength({min:2}),
    body("cotent").trim().isLength({min:5}),
    async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      res.status(422).send({ errors: result.array() });
      return;
    }

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
  
  postRouter.put("/posts/:id", 
    body("title").trim().isLength({min:2}),
    body("cotent").trim().isLength({min:5}),
    async (req, res) => {
      const result = validationResult(req)
      if (!result.isEmpty()) {
        res.status(422).send({ errors: result.array() });
        return;
      }

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