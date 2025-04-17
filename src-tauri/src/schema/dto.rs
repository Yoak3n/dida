use anyhow::Result;
use super::action::{Action,ActionData};
pub fn action(inp:&Action)->Result<ActionData> {
    println!("{} action",inp.typ.clone());
    Ok(ActionData::from_action(inp))
}