use rusqlite::Connection;
use parking_lot::RwLock;
use anyhow::Result;

use super::module::ActionManager;
use crate::{schema::{Action, ActionRecord},utils::help::random_string};
pub struct Database {
    conn: RwLock<Connection>,
}

impl Database {
    pub fn new(db_path: &str) -> Result<Self> {
        let conn = Connection::open(db_path)?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS tasks (
                id TEXT PRIMARY KEY,
                parent_id TEXT,
                name TEXT NOT NULL,
                desc TEXT,
                actions TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                start_at TIMESTAMP,
            )",
            [],
        )?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS actions (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                desc TEXT,
                command TEXT NOT NULL,
                args TEXT,
                typ TEXT NOT NULL
            )",
            [],
        )?;
        Ok(Self {
            conn: RwLock::new(conn),
        })
    }



}


impl ActionManager for Database {
    fn create_action(&self, action: &Action) -> Result<String> {
        let  conn = self.conn.write();
        let mut args_text = String::new();
        if let Some(args) = &action.args {
            args_text = args.join(",");
        }
        let action_id = random_string(6) + "action";
        conn.execute(
            "INSERT INTO actions (id, name, desc, command, args, typ)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            (
                &action_id,
                &action.name,
                &action.desc,
                &action.command,
                &args_text,
                &action.typ
            ))?;
        Ok(action_id)
    }

    fn update_action(&self, action: &Action) -> anyhow::Result<ActionRecord> {
        todo!()
    }

    fn delete_action(&self, id: &str) -> anyhow::Result<()> {
        todo!()
    }

    fn get_action(&self, id: &str) -> anyhow::Result<ActionRecord> {
        todo!()
    }

    fn get_actions(&self, ids: &[String]) -> anyhow::Result<Vec<ActionRecord>> {
        todo!()
    }

    fn get_all_actions(&self) -> anyhow::Result<Vec<crate::schema::ActionRecord>> {
        todo!()
    }
}