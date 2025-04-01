use crate::utils::{dirs, help};
use anyhow::Result;
use serde::{Deserialize, Serialize};

#[derive(Default, Debug, Clone, Deserialize, Serialize)]
pub struct ISetup {
    pub app_log_level: Option<String>,
    pub language: Option<String>,
    pub auto_start: Option<bool>,
    pub silent_start: Option<bool>,
    pub global_hotkey: Option<bool>,
    pub hotkeys: Option<Vec<String>>,
}

impl ISetup {
    pub fn new() -> Self {
        match dirs::config_path().and_then(|path| help::read_yaml::<ISetup>(&path)) {
            Ok(c) => c,
            Err(_) => Self::template(),
        }
    }

    pub fn template() -> Self {
        // 默认配置
        println!("配置文件不存在，使用默认配置");
        Self {
            app_log_level: Some("info".to_string()),
            language: Some("zh-CN".to_string()),
            auto_start: Some(false),
            silent_start: Some(false),
            global_hotkey: Some(false),
            hotkeys: Some(vec![]),
        }
    }
    pub fn save_file(&self) -> Result<()> {
        help::save_yaml(&dirs::config_path()?, &self, Some(""))
    }
}
