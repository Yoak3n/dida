use crate::schema::{Action,AppState};
use crate::feat::action::execute_action;
use tauri::{async_runtime,State};

#[tauri::command]
pub async fn execute_actions(actions: Vec<Action>) -> Result<(), String> {
    // 创建一个 tokio 运行时来执行异步任务
    for action in actions {
        // 检查 action 类型是否需要同步执行
        let is_sync = action.wait > 0 ;
        
        if is_sync {
            // 同步执行 - 等待任务完成
            println!("同步执行任务: {}", &action.name);
            let max_retries = action.retry.unwrap_or(0); // 最大重试次数
            let mut retry_count = 0;
            let mut last_error = String::new();
            while retry_count < max_retries {
                match execute_action(action.clone()).await {
                    Ok(_) => {
                        println!("任务执行成功");
                        break; 
                    },
                    Err(e) => {
                        last_error = e.to_string();
                        retry_count += 1;
                        if retry_count < max_retries {
                            println!("任务执行失败，正在重试 ({}/{}): {}", retry_count, max_retries, &last_error);
                            tokio::time::sleep(tokio::time::Duration::from_millis(1000)).await;
                        }
                    },
                }
            }
            if retry_count >= max_retries{
                return Err(format!("任务执行失败，已达到最大重试次数{}",&last_error));
            }
            
            // 使用异步等待而不是阻塞主线程
            tokio::time::sleep(tokio::time::Duration::from_millis(action.wait as u64)).await;
            
        } else {
            // 异步执行 - 不等待任务完成
            let action_name = action.name.clone();
            let action_clone = action.clone();
            async_runtime::spawn(async move {
                println!("异步执行任务: {}", &action_name);
                if let Err(e) = execute_action(action_clone).await {
                    eprintln!("任务 {} 执行失败: {}", &action_name, e);
                } else {
                    println!("任务 {} 执行成功", &action_name);
                }
            });
        }
    }
    Ok(())
}

use crate::store::module::ActionManager;
#[tauri::command]
pub async fn get_action(state: State<'_, AppState>,id:&str) -> Result<Action, String> {
    let res= state.db.get_action(id);
    match res {
        Ok(data) => {
            let view = Action::try_from(data).unwrap();
            Ok(view)
        },
        Err(e) => {
            println!("获取action失败: {:?}", e);
            Err(e.to_string())
    }
    }
}
