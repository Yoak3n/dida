use crate::schema::{Action,action};
#[tauri::command]
pub async fn execute_action(act:&Action) -> Result<(), String> {
    let data = action(act);
    Ok(())
}