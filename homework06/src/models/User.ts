import "reflect-metadata";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne } from "typeorm"
import { Post } from "./Post.js";


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

    @Column("text" , {array:true})
    posts: Post[];
}