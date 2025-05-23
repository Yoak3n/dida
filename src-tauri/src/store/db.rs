use std::path::PathBuf;

use anyhow::Result;
use parking_lot::RwLock;
use rusqlite::Connection;

use super::module::*;
use crate::{
    schema::{Action, ActionRecord, ActionType,TaskRecord,TaskData},
    utils::help::random_string,
};
pub struct Database {
    conn: RwLock<Connection>,
}
unsafe impl Send for Database {}
unsafe impl Sync for Database {}
impl Database {
    pub fn new(db_path: PathBuf) -> Result<Self> {
        let conn = Connection::open(db_path.join("ducker.db"))?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS tasks (
                id TEXT PRIMARY KEY,
                completed INTEGER DEFAULT 0,
                parent_id TEXT,
                name TEXT NOT NULL,
                desc TEXT,
                actions TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                start_at TIMESTAMP
            )",
            [],
        )?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS actions (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                desc TEXT,
                command TEXT NOT NULL,
                args TEXT,
                typ INTEGER NOT NULL,
                wait INTEGER NOT NULL DEFAULT 0,
                retry INTEGER NOT NULL DEFAULT 0,
                timeout INTEGER
            )",
            [],
        )?;
        Ok(Self {
            conn: RwLock::new(conn),
        })
    }

    
}

impl ActionManager for Database {
    fn create_action(&self, action: &Action) -> Result<ActionRecord> {
        let conn = self.conn.write();
        let mut args_text = String::new();
        if let Some(args) = &action.args {
            args_text = args.join(",");
        }
        let action_id = random_string(6) + "act";
        // let data =ActionData::from_action(&action);
        let data = action.clone();
        let typ:ActionType = ActionType::try_from(data.typ.as_str())?;

        conn.execute(
            "INSERT INTO actions (id, name, desc, command, args, typ, wait, retry, timeout)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
            (
                &action_id,
                &action.name,
                &action.desc,
                &action.command,
                &args_text,
                &(typ.clone() as i8),
                data.wait,
                data.retry,
                data.timeout
            ),
        )?;
        let record = ActionRecord {
            id: action_id.clone(),
            name: data.name,
            desc: data.desc,
            wait: data.wait,
            command: data.command,
            args: args_text.clone(),
            typ,
            retry: data.retry,
            timeout: data.timeout,
        };
        Ok(record)
    }

    fn update_action(&self, id: &str, action: &Action) -> Result<ActionRecord> {
        let conn = self.conn.write();
        let mut args_text = String::new();
        if let Some(args) = &action.args {
            args_text = args.join(",");
        }
        conn.execute(
            "UPDATE actions SET name = ?1, desc = ?2, command = ?3, args = ?4, typ = ?5,wait = ?6, retry = ?7, timeout =?8
            WHERE id = ?9",
            (
                &action.name,
                &action.desc,
                &action.command,
                &args_text,
                (ActionType::try_from(action.typ.as_str())? as u8),
                &action.wait,
                &action.retry,
                &action.timeout,
                id
            ))?;
        self.get_action(id)
    }

    fn delete_action(&self, id: &str) -> Result<()> {
        let conn = self.conn.write();
        conn.execute("DELETE FROM actions WHERE id = ?1", [id])?;
        Ok(())
    }

    fn get_action(&self, id: &str) -> Result<ActionRecord> {
        let conn = self.conn.read();
        let mut stmt = conn.prepare(
            "SELECT 
            id, name, desc, command, args, typ, wait, retry, timeout 
            FROM actions WHERE id = ?1",
        )?;
        let action = stmt.query_row([id], |row| {
            let id = row.get(0)?;
            let name = row.get(1)?;
            let desc = row.get(2)?;
            let command = row.get(3)?;
            let args_text: String = row.get(4)?;
            let typ_number: u8 = row.get(5)?;
            let typ = ActionType::try_from(typ_number).unwrap_or(ActionType::ExecCommand);
            let wait = row.get(6)?;
            let retry: Option<usize> = row.get(7)?;
            let timeout: Option<u64> = row.get(8)?;
            Ok(ActionRecord {
                id,
                name,
                desc,
                wait,
                command,
                args: args_text,
                typ,
                retry,
                timeout,
            })
        })?;
        Ok(action)
    }

    fn get_actions(&self, ids: &[String]) -> Result<Vec<ActionRecord>> {
        if ids.is_empty() {
            return Ok(Vec::new());
        }
        let conn = self.conn.read();
        let placeholders = ids.iter().map(|_| "?").collect::<Vec<_>>().join(",");
        let query = format!(
            "SELECT 
            id, name, desc, command, args, typ, wait, retry, timeout
            FROM actions WHERE id IN ({})",
            placeholders
        );

        let mut stmt = conn.prepare(&query)?;
        let params = ids
            .iter()
            .map(|id| id as &dyn rusqlite::ToSql)
            .collect::<Vec<_>>();

        let action_iter = stmt.query_map(params.as_slice(), |row| {
            let id = row.get(0)?;
            let name = row.get(1)?;
            let desc = row.get(2)?;
            let command = row.get(3)?;
            let args_text: String = row.get(4)?;
            let typ_number: u8 = row.get(5)?;
            let typ = ActionType::try_from(typ_number).unwrap_or(ActionType::ExecCommand);
            let wait = row.get(6)?;
            let retry: Option<usize> = row.get(7)?;
            let timeout: Option<u64> = row.get(8)?;
            Ok(ActionRecord {
                id,
                name,
                desc,
                command,
                args: args_text,
                typ,
                wait,
                retry,
                timeout,
            })
        })?;

        let mut actions = Vec::new();
        for action in action_iter {
            actions.push(action?);
        }

        Ok(actions)
    }

    fn get_all_actions(&self) -> anyhow::Result<Vec<crate::schema::ActionRecord>> {
        let conn = self.conn.read();
        let mut stmt =
            conn.prepare("SELECT 
            id, name, desc, command, args, typ, wait, retry, timeout 
            FROM actions")?;

        let action_iter = stmt.query_map([], |row| {
            let id = row.get(0)?;
            let name = row.get(1)?;
            let desc = row.get(2)?;
            let command = row.get(3)?;
            let args_text: String = row.get(4)?;
            let typ_number: u8 = row.get(5)?;
            let typ = ActionType::try_from(typ_number).unwrap_or(ActionType::ExecCommand);
            let wait = row.get(6)?;
            let retry: Option<usize> = row.get(7)?;
            let timeout: Option<u64> = row.get(8)?;
            Ok(ActionRecord {
                id,
                name,
                desc,
                command,
                args: args_text,
                typ,
                wait,
                retry,
                timeout,
            })
        })?;

        let mut actions = Vec::new();
        for action in action_iter {
            actions.push(action?);
        }

        Ok(actions)
    }
}

impl TaskManager for Database {
    fn create_task(&self, task: &TaskData) -> Result<TaskRecord> {
        let conn = self.conn.write();
        let actions = serde_json::to_string(&task.actions)?;
        
        conn.execute(
            "INSERT INTO tasks (id, name, desc, actions) VALUES (?1, ?2, ?3, ?4)",
            [&task.id, &task.name, &task.desc, &actions],
        )?;

        Ok(TaskRecord {
            id: task.id.clone(),
            completed: false,
            parent_id: None,
            name: task.name.clone(),
            desc: task.desc.clone(),
            actions: task.actions.clone(),
            created_at: chrono::Local::now().to_rfc3339(),
            start_at: None,
        })
    }

    fn update_task(&self, id: &str, task: &TaskData) -> Result<TaskRecord> {
        let conn = self.conn.write();
        let actions = serde_json::to_string(&task.actions)?;
        
        conn.execute(
            "UPDATE tasks SET name = ?1, desc = ?2, actions = ?3 WHERE id = ?4",
            [&task.name, &task.desc, &actions, id],
        )?;

        Ok(TaskRecord {
            id: id.to_string(),
            completed: false, // 保持原有状态
            parent_id: None,  // 保持原有状态
            name: task.name.clone(),
            desc: task.desc.clone(),
            actions: task.actions.clone(),
            created_at: chrono::Local::now().to_rfc3339(),
            start_at: None,
        })
    }

    fn delete_task(&self, id: &str) -> Result<()> {
        let conn = self.conn.write();
        conn.execute("DELETE FROM tasks WHERE id = ?1", [id])?;
        Ok(())
    }

    fn get_task(&self, id: &str) -> Result<TaskRecord> {
        let conn = self.conn.read();
        let mut stmt = conn.prepare("SELECT id, completed, parent_id, name, desc, actions, created_at, start_at FROM tasks WHERE id = ?1")?;
        let task = stmt.query_row([id], |row| {
            let actions: String = row.get(5)?;
            let actions: Vec<String> = serde_json::from_str(&actions).unwrap_or_default();
            
            Ok(TaskRecord {
                id: row.get(0)?,
                completed: row.get(1)?,
                parent_id: row.get(2)?,
                name: row.get(3)?,
                desc: row.get(4)?,
                actions,
                created_at: row.get(6)?,
                start_at: row.get(7)?,
            })
        })?;
        Ok(task)
    }

    fn get_tasks(&self, ids: &[String]) -> Result<Vec<TaskRecord>> {
        // let conn = self.conn.read();
        let mut tasks = Vec::new();
        
        for id in ids {
            if let Ok(task) = self.get_task(id) {
                tasks.push(task);
            }
        }
        
        Ok(tasks)
    }
    fn get_tasks_by_parent_id(&self, parent_id: &str) -> Result<Vec<TaskRecord>> {
        let conn = self.conn.read();
        let mut stmt = conn.prepare("SELECT id, completed, parent_id, name, desc, actions, created_at, start_at FROM tasks WHERE parent_id = ?1")?;
        let tasks = stmt.query_map([parent_id], |row| {
            let actions: String = row.get(5)?;
            let actions: Vec<String> = serde_json::from_str(&actions).unwrap_or_default();
            
            Ok(TaskRecord {
                id: row.get(0)?,
                completed: row.get(1)?,
                parent_id: row.get(2)?,
                name: row.get(3)?,
                desc: row.get(4)?,
                actions,
                created_at: row.get(6)?,
                start_at: row.get(7)?,
            })
        })?;
        
        let mut result = Vec::new();
        for task in tasks {
            result.push(task?);
        }
        Ok(result)
    }
    fn get_tasks_uncompleted(&self) -> Result<Vec<TaskRecord>> {
        let conn = self.conn.read();
        let mut stmt = conn.prepare("SELECT id, completed, parent_id, name, desc, actions, created_at, start_at FROM tasks WHERE completed = 0")?;
        let tasks = stmt.query_map([], |row| {
            let actions: String = row.get(5)?;
            let actions: Vec<String> = serde_json::from_str(&actions).unwrap_or_default();
            
            Ok(TaskRecord {
                id: row.get(0)?,
                completed: row.get(1)?,
                parent_id: row.get(2)?,
                name: row.get(3)?,
                desc: row.get(4)?,
                actions,
                created_at: row.get(6)?,
                start_at: row.get(7)?,
            })
        })?;
        
        let mut result = Vec::new();
        for task in tasks {
            result.push(task?);
        }
        Ok(result)
    }

    fn get_all_tasks(&self) -> Result<Vec<TaskRecord>> {
        let conn = self.conn.read();
        let mut stmt = conn.prepare("SELECT id, completed, parent_id, name, desc, actions, created_at, start_at FROM tasks")?;
        let tasks = stmt.query_map([], |row| {
            let actions: String = row.get(5)?;
            let actions: Vec<String> = serde_json::from_str(&actions).unwrap_or_default();
            
            Ok(TaskRecord {
                id: row.get(0)?,
                completed: row.get(1)?,
                parent_id: row.get(2)?,
                name: row.get(3)?,
                desc: row.get(4)?,
                actions,
                created_at: row.get(6)?,
                start_at: row.get(7)?,
            })
        })?;
        
        let mut result = Vec::new();
        for task in tasks {
            result.push(task?);
        }
        Ok(result)
    }
}