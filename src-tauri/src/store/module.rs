use anyhow::Result;
use crate::schema::{Action, ActionRecord};
pub trait ActionManager {
    fn create_action(&self, action: &Action) -> Result<ActionRecord>;
    fn update_action(&self,id:&str, action: &Action) -> Result<ActionRecord>;
    fn delete_action(&self, id: &str) -> Result<()>;
    fn get_action(&self, id: &str) -> Result<ActionRecord>;
    fn get_actions(&self, ids: &[String]) -> Result<Vec<ActionRecord>>;
    fn get_all_actions(&self) -> Result<Vec<ActionRecord>>;
}