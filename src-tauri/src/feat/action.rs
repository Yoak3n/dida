use tauri::AppHandle;

use crate::schema::{Action,action};

#[tauri::command]
pub async fn execute_action(app:AppHandle,act:Action) -> Result<(), String> {
    let data = action(&act).unwrap();

    match data.typ{
        _ => {
            use tauri_plugin_opener::OpenerExt;
            println!("{:?}",&data.command);
            let opener = app.opener();
            let output = opener.open_path(data.command,None::<&str>);
            match output  {
                Err(e)=>{
                    return Err(e.to_string());
                },
                _ => {}
            }
            
        }
    }
    Ok(())
}

