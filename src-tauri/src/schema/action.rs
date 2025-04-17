use serde::{Deserialize, Serialize};

#[allow(dead_code)]
#[derive(Deserialize,Serialize, Debug)]
pub struct Action {
    pub name: String,
    pub desc: String,
    pub command: String,
    pub args: Option<Vec<String>>,
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
    pub args : Option<Vec<String>>,
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
        match action.typ.as_str() {
            "open_dir" => data.typ = ActionType::OpenDir,
            "open_file" => data.typ = ActionType::OpenFile,
            "open_url" => data.typ = ActionType::OpenUrl,
            "exec_command" =>  data.typ = ActionType::ExecCommand,
            _ => {}
        }
        data
    }
}