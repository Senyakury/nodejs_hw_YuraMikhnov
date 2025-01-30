import "reflect-metadata";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne } from "typeorm"
import { Post } from "./Post";
import { Comment } from "./Comment";


@Entity("users")
export class User {
    @PrimaryGeneratedColumn("increment")
    id:number

    @Column("text")
    name:string

    @Column("text")
    email:string

    @Column("integer")
    age:number

    @Column("text")
    password:string
    
    @OneToMany(() => Post, (post) => post.author , { onDelete: "CASCADE" , eager: true}) 
    posts: Post[]

    @OneToMany(() => Post, (post) => post.author , { onDelete: "CASCADE" , eager: true}) 
    comments: Comment[]
}