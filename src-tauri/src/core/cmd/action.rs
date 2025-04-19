use crate::schema::Action;
use crate::feat::action::execute_action;
use tauri::async_runtime;

#[tauri::command]
pub async fn execute_actions(actions: Vec<Action>) -> Result<(), String> {
    // 创建一个 tokio 运行时来执行异步任务
    for action in actions {
        // 检查 action 类型是否需要同步执行
        let is_sync = action.wait > 0 ;
        
        if is_sync {
            // 同步执行 - 等待任务完成
            println!("同步执行任务: {}", &action.name);
            match execute_action(&action).await {
                Ok(_) => println!("任务执行成功"),
                Err(e) => {
                    return Err(format!("任务执行失败: {}", e))
                },
            }
            
            // 使用异步等待而不是阻塞主线程
            tokio::time::sleep(tokio::time::Duration::from_millis(action.wait as u64)).await;
            
        } else {
            // 异步执行 - 不等待任务完成
            let action_name = action.name.clone();
            let action_clone = action.clone();
            async_runtime::spawn(async move {
                println!("异步执行任务: {}", &action_name);
                if let Err(e) = execute_action(&action_clone).await {
                    eprintln!("任务 {} 执行失败: {}", &action_name, e);
                } else {
                    println!("任务 {} 执行成功", &action_name);
                }
            });
        }
    }
    Ok(())
}

