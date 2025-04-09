interface IAction{
    name:string,
    desc:string,
    command:string,
    args:string[],
    typ:string,
}

export type Action = IAction;