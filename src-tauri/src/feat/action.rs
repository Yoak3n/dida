use std::process::Command;
use crate::schema::{action, Action, ActionType};
use tauri_plugin_opener::OpenerExt;


pub async fn execute_action(act:&Action) -> Result<(), String> {
    let data = action(&act).unwrap();

    match data.typ{
        ActionType::OpenDir => {
            open_path(data.command).await?;
        }
        ActionType::OpenFile => {
            open_path(data.command).await?;
        }
        ActionType::OpenUrl => {
            open_url(data.command).await?;
        }
        ActionType::ExecCommand => {
            execute_command(data.command,data.args).await?;
        }
        ActionType::SyncExecCommand => {
            execute_command(data.command,data.args).await?;
        }
        ActionType::SyncOpenDir => {
            
        }
        ActionType::SyncOpenFile => {
            
        }
        ActionType::SyncOpenUrl => {
            
        }
    }
    Ok(())
}
use crate::core::handle::Handle;
async fn open_path(path:String)->Result<(),String>{
    let handle = Handle::global();
    let app_handle = handle.app_handle().unwrap();
    let opener = app_handle.opener();
    if let Err(output) = opener.open_path(path,None::<&str>){
        return Err(output.to_string());
    };
    Ok(())
} 
async fn open_url(url:String)->Result<(),String>{
    let handle = Handle::global();
    let app_handle = handle.app_handle().unwrap();
    let opener = app_handle.opener();
    if let Err(output) = opener.open_url(url,None::<&str>){
        return Err(output.to_string());
    };
    Ok(())
} 


async fn execute_command(command:String,args:Option<Vec<String>>)->Result<String,String>{
    let mut cmd = Command::new("cmd");
    cmd.arg("/C").arg(&command);
    if let Some(args) = args.as_ref(){
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

    Ok(output_message.to_string())
}


