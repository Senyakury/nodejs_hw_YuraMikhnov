import "reflect-metadata";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne , JoinColumn} from "typeorm"
import { User } from "./User"
import { Post } from "./Post";


@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("text")
  content: string

  @ManyToOne(() => User, (user) => user.comments,{ onDelete: "CASCADE" })
  author: User

  @ManyToOne(() => Post, (post) => post.comments,{ onDelete: "CASCADE" })
  post: Post

  @Column("integer")
  postId:number

  @Column("integer")
  authorId:number
}