import jwt from 'jsonwebtoken';
import { Router , Request , Response } from 'express';
import { authenticateToken , JWT_SECRET_KEY } from "../middleware/authentificator";
import { userService } from '../services/UserService';
import bcrypt from "bcryptjs"
import { postService } from '../services/PostService';
import { body , validationResult } from 'express-validator';



export const UserAdminRouter = Router()
UserAdminRouter.get("/register",async (req:Request , res:Response)=>{
    res.render("register")
})

UserAdminRouter.post("/register",
    body("email").isEmail(),
    body("name").isLength({min:2}),
    body("age").isLength({max:2})
  ,async (req:Request , res:Response)=>{
    const result = validationResult(req)
    if (!result.isEmpty()) {
      res.status(422).send({ errors: result.array() });
      return;
    }

    res.clearCookie('accessToken');
    const {name , email , password, age} = req.body
    const userByName = await userService.getUserBy({name})
    const userByEmail = await userService.getUserBy({email})
    if(userByName || userByEmail){
        res.status(400).send("User Exists with those email or name")
        return
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await userService.createUser(name,email,passwordHash,age)
    const token = jwt.sign({ email }, JWT_SECRET_KEY, {
        expiresIn: '1h',
    });
    res.cookie('accessToken', token, {
        httpOnly: true,
        sameSite: 'strict',
    });
    res.redirect("/main")
  })


UserAdminRouter.get("/login",(req:Request,res:Response)=>{
    res.render("login");
})

UserAdminRouter.post("/login", async (req:Request,res:Response)=>{
    const {name , email , password } = req.body
    const user = await userService.getUserBy({name,email})
    
    if (!user) {
        res.status(400).send("User not found")
        return
    }

    const passwordCheck = await bcrypt.compare(password , user.password)
    if (!passwordCheck) {
        res.status(401).send("Invalid password")
        return
    }
    
    const token = jwt.sign({ email: user.email  }, JWT_SECRET_KEY, {
        expiresIn: '1h',
      });
      res.cookie('accessToken', token, {
        httpOnly: true,
        sameSite: 'strict',
      })
      res.redirect('/main');
}) 
UserAdminRouter.get('/main', authenticateToken, async (req:Request, res:Response) => {
  try{
    const user = req.user
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    const posts = await postService.getAllPosts();
    const authors = await userService.getAllUsers()
  
    const postsWithAuthors = posts.map(post => {
        const author = authors.find(author => author.id === post.authorId);
        return {
            ...post,
            authorName: author ? author.name : 'Unknown Author'
        };
    });
    res.render("main", {
        user: user.name,
        email: user.email,
        age: user.age,
        UserPosts: user.posts,
        posts: postsWithAuthors
    });
  } catch(error){
    console.error("Error ocururred :",error)
  }

});

  UserAdminRouter.get("/main/profile", authenticateToken , async (req:Request, res:Response)=>{
    const user = req.user
    res.render("profile",{
        user:user
    })
  })
  UserAdminRouter.get("/main/profile/updateuser/:id", authenticateToken ,  async (req:Request, res:Response)=>{
    const user = req.user
    res.render("updateuser",{
        id:user.id
    })
  })
  UserAdminRouter.post("/main/profile/updateuser/:id",authenticateToken,
    body("email").isEmail(),
    body("name").isLength({min:2}),
    body("age").isLength({max:2})
    ,  async (req:Request, res:Response)=>{
    try {
      const result = validationResult(req)
      if (!result.isEmpty()) {
        res.status(422).send({ errors: result.array() });
        return;
      }

      const { name, email, password, age } = req.body;
      const id = req.params.id;
      const user = await userService.getUserBy({ id });

      const passwordHash = password ? await bcrypt.hash(password, 10) : user.password;

      const checkName = await userService.getUserBy({name})

      const checkEmail = await userService.getUserBy({email})
      const checkPassword = await userService.getUserBy({password : bcrypt.hash(password,10)})
      if (checkName) {
        res.status(400).send("User Exists with those name")
        return
      }
      if (checkEmail) {
        res.status(400).send("User Exists with those email")
        return
      }
      if (checkPassword) {
        res.status(400).send("User Exists with those password")
        return
      }
      if (!user) {
          return res.status(404).send("User not found");
      }

      const updatedUser = {
          id: user.id,
          name: name || user.name,
          email: email || user.email,
          password: passwordHash,
          age: age || user.age,
      };

      await userService.updateUser(updatedUser.id, updatedUser.name, updatedUser.email, updatedUser.password, updatedUser.age);

      res.clearCookie("accessToken");
      const newToken = jwt.sign({ email: updatedUser.email }, JWT_SECRET_KEY, { expiresIn: "1h" });
      res.cookie("accessToken", newToken, { httpOnly: true, sameSite: "strict" });

      res.redirect("/main");
  } catch (error) {
      console.error("Error updating user:", error);
      if (!res.headersSent) {
          res.status(500).send("Internal Server Error");
      }
  }
    
  })
  UserAdminRouter.get("/main/profile/deleteuser/:id",authenticateToken,  async (req:Request, res:Response)=>{
    const user = req.user
    res.render("deleteuser",{
        id:user.id
    })
  })
  UserAdminRouter.post("/main/profile/deleteuser/:id",authenticateToken,  async (req:Request, res:Response)=>{
    const user = req.user
    await userService.deleteUser(user.id)
    res.redirect("/login")
  })