export type ActionType = 'open_file' | 'open_dir' | 'open_url' | 'exec_command' | '';

interface IAction{
    name:string,
    desc:string,
    command:string,
    args?:string[],
    typ:ActionType,
    wait:number,
    retry?:number,
}

// export enum ActionType{
//    OPEN_FILE = 'open_file',
//    OPEN_DIR = 'open_dir',
//    OPEN_URL = 'open_url', 
//    EXEC_COMMAND = 'exec_command',

// }
export type Action = IAction;