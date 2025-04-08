import type { Action } from "./action"

interface ITask{
    id?:number,
    title:string,
    description:string,
    completed:boolean,
    actions:Action[]
    createdAt:Date,
    dueDate:Date
}

export type Task = ITask;

export type TaskList = Array<Task>;

export type TaskStatus = "all" | "completed" | "incomplete";