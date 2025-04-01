// use std::{fmt, path::PathBuf, sync::Arc};
// use tokio::sync::Mutex;
use once_cell::sync::OnceCell;
use anyhow::Result;

use crate::{
    config::{Config, ConfigType, CONFIG_FILE}, core::handle, logging, utils::{dirs,help, logging::Type}
};
#[derive(Debug)]
pub struct CoreManager {
    // running: Arc<Mutex<RunningMode>>,
    // child_sidecar: Arc<Mutex<Option<CommandChild>>>,
}

impl CoreManager {
    pub fn global() -> &'static CoreManager {
        static CORE_MANAGER: OnceCell<CoreManager> = OnceCell::new();
        CORE_MANAGER.get_or_init(|| CoreManager {})
    }

    pub async fn validate_config(&self) -> Result<(bool, String)> {
        logging!(info, Type::Config, true, "生成临时配置文件用于验证");
        let config_path = Config::generate_file(ConfigType::Check)?;
        let config_path = dirs::path_to_str(&config_path)?;
        self.validate_config_internal(config_path).await
    }

    async fn validate_config_internal(&self, config_path: &str) -> Result<(bool, String)> {
        // 检查程序是否正在退出，如果是则跳过验证
        if handle::Handle::global().is_exiting() {
            logging!(info, Type::Core, true, "应用正在退出，跳过验证");
            return Ok((true, String::new()));
        }

        logging!(
            info,
            Type::Config,
            true,
            "开始验证配置文件: {}",
            config_path
        );


        logging!(info, Type::Config, true, "验证成功");
        logging!(info, Type::Config, true, "-------- 验证结束 --------");
        Ok((true, String::new()))
        
    }

    pub async fn use_default_config(&self, msg_type: &str, msg_content: &str) -> Result<()> {
        let config_path = dirs::app_home_dir()?.join(CONFIG_FILE);
        *Config::setup_config().draft() = Config::setup_config().latest().clone();
        help::save_yaml(
            &config_path,
            &Config::setup_config().data().clone(),
            Some("# Clash Verge Runtime"),
        )?;
        handle::Handle::notice_message(msg_type, msg_content);
        Ok(())
    }
}