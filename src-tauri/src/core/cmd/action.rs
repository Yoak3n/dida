use crate::schema::Action;
use crate::feat::action::execute_action;
use tokio::runtime::Runtime;

#[tauri::command]
pub fn execute_actions(actions: Vec<Action>) -> Result<(), String> {
    // 创建一个 tokio 运行时来执行异步任务
    let rt = Runtime::new().map_err(|e| e.to_string())?;
    
    for action in actions {
        // 检查 action 类型是否需要同步执行
        let is_sync = action.typ.starts_with("sync_") || 
                      action.typ.starts_with("Sync");
        
        if is_sync {
            // 同步执行 - 等待任务完成
            rt.block_on(async {
                println!("同步执行任务: {}", &action.name);
                match execute_action(&action).await {
                    Ok(_) => println!("任务执行成功"),
                    Err(e) => return Err(format!("任务执行失败: {}", e)),
                }
                Ok(())
            })?;
        } else {
            // 异步执行 - 不等待任务完成
            let action_name = action.name.clone();
            rt.spawn(async move {
                println!("异步执行任务: {}", &action_name);
                if let Err(e) = execute_action(&action).await {
                    eprintln!("任务 {} 执行失败: {}", &action_name, e);
                } else {
                    println!("任务 {} 执行成功", &action_name);
                }
            });
        }
    }
    
    Ok(())
}