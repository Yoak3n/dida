use serde::{Deserialize,Serialize};

#[derive(Deserialize,Serialize, Debug)]
pub struct TaskRecord {
    pub id: String,
    pub completed: bool,
    pub parent_id: Option<String>,
    pub name: String,
    pub desc: String,
    pub actions: Vec<String>,
    pub created_at: String,
    pub start_at: Option<String>,
}

#[derive(Deserialize,Serialize, Debug)]
pub struct TaskView {
    pub id: String,
    pub name: String,
    pub desc: String,
    pub actions: Vec<String>,
    pub children: Vec<TaskView>,
}