import { Router } from "express";
import { userService } from "../src/UserService.js";

const userRouter = Router();

userRouter.post("/users", async (req, res) => {
  const { name, email, age } = req.body;
  try {
    const user = await userService.createUser( name, email, age );
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

userRouter.get("/users", async (req, res) => {
  try {
    const users = await userService.getAllUsers(req.query);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

userRouter.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userService.getUserById(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

userRouter.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  try {
    const user = await userService.updateUser(id, name, email, age);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

userRouter.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const message = await userService.deleteUser(id);
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



userRouter.get("/users/:id/posts", async (req, res) => {
    const { id } = req.params;
    try {
      const user = await userService.getPostByUserId( id );

      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  userRouter.post("/posts", async (req, res) => {
    const { title , content , status , authorId} = req.body;
    try {
      const user = await userService.createPost({ title , content , status} , authorId);
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  userRouter.get("/posts", async (req, res) => {
    try {
      const users = await userService.getAllPosts(req.query);
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  userRouter.get("/posts/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const user = await userService.getPostById(id);
      if (!user) {
        res.status(404).json({ error: "Post not found" });
        return;
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  userRouter.put("/posts/:id", async (req, res) => {
    const { id } = req.params;
    const { title , content , status} = req.body;
    try {
      const user = await userService.updatePost(id , title , content , status );
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  userRouter.delete("/posts/:id", async (req , res) => {
    const { id } = req.params;
    try {
      const message = await userService.deletePost(id);
      res.json(message);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

export default userRouter;