use std::path::PathBuf;

use rusqlite::Connection;
use parking_lot::RwLock;
use anyhow::Result;

use super::module::ActionManager;
use crate::{
    schema::{Action, ActionRecord, ActionType,ActionData},
    utils::help::random_string};
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
                await INTEGER NOT NULL DEFAULT 0
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
        let  conn = self.conn.write();
        let mut args_text = String::new();
        if let Some(args) = &action.args {
            args_text = args.join(",");
        }
        let action_id = random_string(6) + "act";
        let data =ActionData::from_action(&action);
        let record = ActionRecord {
            id: action_id.clone(),
            name: data.name,
            desc: data.desc,
            wait:data.wait,
            command: data.command,
            args: args_text.clone(),
            typ: data.typ.clone(),
        };
        let typ_value: u8 = data.typ.into();
        conn.execute(
            "INSERT INTO actions (id, name, desc, command, args, typ,wait)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            (
                &action_id,
                &action.name,
                &action.desc,
                &action.command,
                &args_text,
                typ_value,
                data.wait
            ))?;
        Ok(record)
    }

    fn update_action(&self,id: &str, action: &Action) -> Result<ActionRecord> {
        let conn = self.conn.write();
        let mut args_text = String::new();
        if let Some(args) = &action.args {
            args_text = args.join(",");
        }
        conn.execute(
            "UPDATE actions SET name = ?1, desc = ?2, command = ?3, args = ?4, typ = ?5,wait =?6
            WHERE id = ?7",
            (
                &action.name,
                &action.desc,
                &action.command,
                &args_text,
                &action.typ,
                &action.wait,
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
        let mut stmt = conn.prepare("SELECT id, name, desc, command, args, typ,wait FROM actions WHERE id = ?1")?;
        let action = stmt.query_row([id], |row| {
            let id = row.get(0)?;
            let name = row.get(1)?;
            let desc = row.get(2)?;
            let command = row.get(3)?;
            let args_text: String = row.get(4)?;
            let typ_number: u8 = row.get(5)?;
            let typ = ActionType::try_from(typ_number).unwrap_or(ActionType::ExecCommand);
            let wait = row.get(6)?;
            Ok(ActionRecord {
                id,
                name,
                desc,
                wait,
                command,
                args:args_text,
                typ,
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
            "SELECT id, name, desc, command, args, typ,wait FROM actions WHERE id IN ({})",
            placeholders
        );
        
        let mut stmt = conn.prepare(&query)?;
        let params = ids.iter().map(|id| id as &dyn rusqlite::ToSql).collect::<Vec<_>>();
        
        let action_iter = stmt.query_map(params.as_slice(), |row| {
            let id = row.get(0)?;
            let name = row.get(1)?;
            let desc = row.get(2)?;
            let command = row.get(3)?;
            let args_text: String = row.get(4)?;
            let typ_number: u8 = row.get(5)?;
            let typ = ActionType::try_from(typ_number).unwrap_or(ActionType::ExecCommand);
            let wait = row.get(6)?;
            Ok(ActionRecord {
                id,
                name,
                desc,
                command,
                args:args_text,
                typ,
                wait,
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
        let mut stmt = conn.prepare("SELECT id, name, desc, command, args, typ, wait FROM actions")?;
        
        
        let action_iter = stmt.query_map([], |row| {
            let id = row.get(0)?;
            let name = row.get(1)?;
            let desc = row.get(2)?;
            let command = row.get(3)?;
            let args_text: String = row.get(4)?;
            let typ_number: u8 = row.get(5)?;
            let typ = ActionType::try_from(typ_number).unwrap_or(ActionType::ExecCommand);
            let wait = row.get(6)?;
            Ok(ActionRecord {
                id,
                name,
                desc,
                command,
                args:args_text,
                typ,
                wait,
            })
        })?;
        
        let mut actions = Vec::new();
        for action in action_iter {
            actions.push(action?);
        }
        
        Ok(actions)
    }
}

