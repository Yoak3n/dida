use serde::{Deserialize, Serialize};

#[allow(dead_code)]
#[derive(Deserialize,Serialize, Debug)]
pub struct Action {
    pub name: String,
    pub desc: String,
    pub sync: bool,
    pub command: String,
    pub args: Option<Vec<String>>,
    pub typ:String,
}

#[allow(dead_code)]
#[derive(Deserialize, Debug)]
pub struct ActionRecord {
    pub id: String,
    pub typ:ActionType,
    pub name: String,
    pub sync: bool,
    pub desc: String,
    pub command: String,
    pub args: String,
}

pub struct ActionData{
    pub name : String,
    pub typ : ActionType,
    pub desc : String,
    pub sync: bool,
    pub command : String,
    pub args : Option<Vec<String>>,
}
#[derive(Deserialize,Debug,Clone)]
#[repr(u8)]
pub enum ActionType {
    OpenDir = 0,
    OpenFile,
    OpenUrl,
    ExecCommand,
}
impl From<ActionType> for u8 {
    fn from(action_type: ActionType) -> Self {
        action_type as u8
    }
}

impl TryFrom<u8> for ActionType {
    type Error = anyhow::Error;
    
    fn try_from(value: u8) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(ActionType::OpenDir),
            1 => Ok(ActionType::OpenFile),
            2 => Ok(ActionType::OpenUrl),
            3 => Ok(ActionType::ExecCommand),
            _ => Err(anyhow::anyhow!("无效的 ActionType 值: {}", value)),
        }
    }
}
impl ActionData {
    pub fn from_action(action : &Action) -> ActionData {
        let mut data = ActionData {
            name: action.name.clone(),
            desc: action.desc.clone(),
            sync: action.sync,
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
