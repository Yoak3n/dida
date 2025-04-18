use tauri::AppHandle;
use std::process::Command;
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
            println!("执行命令：{:?}",&data.command);
            // 暂时只支持windows命令行，减少开发阶段的心智负担
            let mut cmd = Command::new("cmd");
            cmd.arg("/C").arg(&data.command);
            if let Some(args) = data.args.as_ref(){
                for arg in args{
                    cmd.arg(arg);
                }
            }
            let output = cmd
                .output()
                .map_err(|e| e.to_string())?;
            if !output.status.success(){
                let error_message = String::from_utf8_lossy(&output.stderr);
                return Err(error_message.to_string());
            }
            let output_message = String::from_utf8_lossy(&output.stdout);
            println!("命令输出: {}", output_message);
        }
        _ => {}
    }
    Ok(())
}

