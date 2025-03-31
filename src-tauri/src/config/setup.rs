use serde::{Deserialize, Serialize};
use anyhow::Result;
use crate::utils::{dirs, help};

#[derive(Default, Debug, Clone, Deserialize, Serialize)]
pub struct ISetup{
    pub app_log_level: Option<String>,
    pub language: Option<String>,
    pub auto_start: Option<bool>,
    pub silent_start: Option<bool>,
}

impl ISetup  {
    pub fn new() -> Self {
        match  dirs::config_path().and_then(|path|help::read_yaml::<ISetup>(&path)) {
            Ok(c) => c,
            Err(_) => Self::template()
        }
    }

    pub fn template()->Self{
        Self{
            app_log_level: Some("info".to_string()),
            language: Some("zh-CN".to_string()),
            auto_start: Some(false),
            silent_start: Some(false),
        }
    }
    pub fn save_file(&self) -> Result<()> {
        help::save_yaml(&dirs::config_path()?, &self, Some("# Clash Verge Config"))
    }
}