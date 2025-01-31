import bcrypt from 'bcryptjs';
import { Router } from "express";
import { userService } from "../services/UserService";
import { body, validationResult } from "express-validator"

const userRouter = Router();

userRouter.post("/users",
  body("name").trim().isLength({min:2}),
  body("email").trim().isEmail(),
  body("age").trim().isNumeric().isLength({max:2}),
  async (req, res) => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    res.status(422).send({ errors: result.array() });
    return;
  }
  
  const { name, email, password , age } = req.body;
  const passwordHash = bcrypt.hash(password,10)

  try {
    const user = await userService.createUser( name, email, passwordHash , age );
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
    const user = await userService.getUserBy({id});
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

userRouter.put("/users/:id",
  body("name").trim().isLength({min:2}),
  body("email").trim().isEmail(),
  body("age").trim().isNumeric().isLength({max:2}),
  async (req, res) =>{
  const result = validationResult(req)
  if (!result.isEmpty()) {
    res.status(422).send({ errors: result.array() });
    return;
  }
  
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





export default userRouter;