import type { Action } from "./action"

interface ITask{
    id?:number,
    name:string,
    completed:boolean,
    parent_id?:string,
    desc:string,
    actions:Action[]
    createdAt:Date,
    dueDate:Date
}
interface ITaskView{
    id?:number,
    name:string,
    desc:string,
    parent_id?:string,
    completed:boolean,
    actions:Action[]
    createdAt:Date,
    dueDate:Date
    avatar?:string
}

export type Task = ITask;
export type TaskView = ITaskView;

export type TaskList = Array<Task>;

export type TaskStatus = "all" | "completed" | "incomplete";