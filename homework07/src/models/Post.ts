import "reflect-metadata";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne , JoinColumn , OneToMany} from "typeorm"
import { User } from "./User"
import { Comment } from "./Comment";


@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("text")
  title: string;

  @Column("text")
  content: string;

  @Column("text")
  status: string;
 
  @ManyToOne(() => User, (user) => user.posts,{ onDelete: "CASCADE" })
  author: User

  @OneToMany(() => Comment, (comment) => comment.post , { onDelete: "CASCADE" , eager: true}) 
  comments: Comment[]

  @Column("integer")
  authorId: number
  
  @Column("date")
  createdAt: string;

  @Column("date")
  updatedAt: string;

}