use tauri::State;
use crate::{
    schema::{
        AppState,
        task::{TaskRecord, TaskView,TaskData}
    },
    store::module::TaskManager,
    utils::help::random_string
};



#[tauri::command]
pub async fn create_task(state: State<'_, AppState>, task: TaskData) -> Result<String, String> {
    let res = state.db.create_task(&task);
    match res {
        Ok(data) => {
            Ok(data.id)
        },
        Err(e) => {
            println!("创建任务失败: {:?}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command]
pub async fn update_task(state: State<'_, AppState>, id: &str, task: TaskData) -> Result<TaskRecord, String> {
    let res = state.db.update_task(id, &task);
    match res {
        Ok(data) => Ok(data),
        Err(e) => {
            println!("更新任务失败: {:?}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command]
pub async fn delete_task(state: State<'_, AppState>, id: String) -> Result<(), String> {
    let res = state.db.delete_task(&id);
    match res {
        Ok(_) => Ok(()),
        Err(e) => {
            println!("删除任务失败: {:?}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command]
pub async fn get_task(state: State<'_, AppState>, id: String) -> Result<TaskView, String> {
    let res = state.db.get_task(&id);
    match res {
        Ok(data) => Ok(TaskView::try_from((data, state.inner())).unwrap()),
        Err(e) => {
            println!("获取任务失败: {:?}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command]
pub async fn get_all_tasks(state: State<'_, AppState>) -> Result<Vec<TaskView>, String> {
    let res = state.db.get_all_tasks();
    match res {
        Ok(data) => {
            let mut tasks = Vec::new();
            for task in data {
                tasks.push(task.into());
            }
            Ok(tasks)
        },
        Err(e) => {
            println!("获取所有任务失败: {:?}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command]
pub async fn get_tasks_uncompleted(state: State<'_, AppState>) -> Result<Vec<TaskRecord>, String> {
    let res = state.db.get_tasks_uncompleted();
    match res {
        Ok(data) => Ok(data),
        Err(e) => {
            println!("获取未完成任务失败: {:?}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command]
pub async fn gen_random_task_id() -> Result<String, String> {
    
    let random_str = random_string(6) + "task";
    Ok(random_str)
}
// #[tauri::command]
// pub async fn execute_task_actions(state: State<'_, AppState>, id: String) -> Result<(), String> {
//     let task = state.db.get_task(&id).map_err(|e| e.to_string())?;
//     let actions = state.db.get_actions(&task.actions).map_err(|e| e.to_string())?;
    
//     for action in actions {
//         execute_action(action.into()).await?;
//     }
//     Ok(())
// }