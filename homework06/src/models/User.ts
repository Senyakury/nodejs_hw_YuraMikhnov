import "reflect-metadata";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne } from "typeorm"
import { Post } from "./Post";


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

    @OneToMany(() => Post, (post) => post.author , { onDelete: "CASCADE" }) 
    posts: Post[]
}