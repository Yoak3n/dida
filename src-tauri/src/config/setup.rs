use serde::{Deserialize, Serialize};

#[derive(Default, Debug, Clone, Deserialize, Serialize)]
pub struct ISetup{
    pub app_log_level: Option<String>,
    pub language: Option<String>,
    pub auto_start: Option<bool>,
    pub silent_start: Option<bool>,
}