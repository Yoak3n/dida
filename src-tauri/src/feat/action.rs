use tauri::AppHandle;

use crate::schema::{Action,ActionType,action};
use tauri_plugin_opener::OpenerExt;
#[tauri::command]
pub async fn execute_action(app:AppHandle,act:Action) -> Result<(), String> {
    let data = action(&act).unwrap();

    match data.typ{
        ActionType::OpenDir => {
            println!("{:?}",&data.command);
            let opener = app.opener();
            if let Err(output) = opener.open_path(data.command,None::<&str>){
                return Err(output.to_string());
            };
        }
        ActionType::OpenFile => {
            println!("{:?}",&data.command);
            let opener = app.opener();
            if let Err(output) = opener.open_path(data.command,None::<&str>){
                return Err(output.to_string());
            };
        }
        ActionType::OpenUrl => {
            println!("{:?}",&data.command);
            let opener = app.opener();
            if let Err(output) = opener.open_url(data.command,None::<&str>){
                return Err(output.to_string());
            };
        }
        ActionType::ExecCommand => {
            
        }
        _ => {}
    }
    Ok(())
}

