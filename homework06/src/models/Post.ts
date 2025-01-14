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
 
  @Column("integer")
  authorId: number;
  
  @Column("date")
  createdAt: Date;

  @Column("date")
  updatedAt: Date;

}