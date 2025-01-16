import "reflect-metadata";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne , JoinColumn} from "typeorm"
import { User } from "./User"


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

  @Column("integer",{ nullable: true })
  authorId: number
  
  @Column("date")
  createdAt: string;

  @Column("date")
  updatedAt: string;

}