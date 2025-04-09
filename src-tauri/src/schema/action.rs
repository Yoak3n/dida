use serde::{Deserialize, Serialize};

#[allow(dead_code)]
#[derive(Deserialize,Serialize, Debug)]
pub struct Action {
    pub name: String,
    pub desc: String,
    pub command: String,
    pub args: Vec<String>,
    pub typ:String,
}

#[allow(dead_code)]
#[derive(Deserialize, Debug)]
pub struct ActionRecord {
    pub id: usize,
    pub name: String,
    pub desc: String,
    pub command: String,
    pub args: Vec<String>,
    pub task_id: usize,
}

pub struct ActionData{
    pub name : String,
    pub typ : ActionType,
    pub desc : String,
    pub command : String,
    pub args : Vec<String>,
}
pub enum ActionType {
    OpenDir,
    OpenFile,
    OpenUrl,
    ExecCommand,
}

impl ActionData {
    pub fn from_action(action : &Action) -> ActionData {
        let mut data = ActionData {
            name: action.name.clone(),
            desc: action.desc.clone(),
            command: action.command.clone(),
            args: action.args.clone(),
            typ: ActionType::ExecCommand,
        };
        data.typ = ActionType::OpenDir;
        data
    }
}