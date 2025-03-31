use std::{fs, path::PathBuf};

use once_cell::sync::OnceCell;
use anyhow::Result;

use crate::core::handle;

pub static CLASH_CONFIG: &str = "config.yaml";
pub static PORTABLE_FLAG: OnceCell<bool> = OnceCell::new();

pub fn init_portable_flag() -> Result<()> {
    use tauri::utils::platform::current_exe;

    let app_exe = current_exe()?;
    if let Some(dir) = app_exe.parent() {
        let dir = PathBuf::from(dir).join(".config/PORTABLE");

        if dir.exists() {
            PORTABLE_FLAG.get_or_init(|| true);
        }
    }
    PORTABLE_FLAG.get_or_init(|| false);
    Ok(())
}
pub fn app_home_dir() -> Result<PathBuf> {
    use tauri::utils::platform::current_exe;

    let flag = PORTABLE_FLAG.get().unwrap_or(&false);
    if *flag {
        let app_exe = current_exe()?;
        let app_exe = dunce::canonicalize(app_exe)?;
        let app_dir = app_exe
            .parent()
            .ok_or(anyhow::anyhow!("failed to get the portable app dir"))?;
        return Ok(PathBuf::from(app_dir).join(".config").join(APP_ID));
    }
    let app_handle = handle::Handle::global().app_handle().unwrap();

    match app_handle.path().data_dir() {
        Ok(dir) => Ok(dir.join(APP_ID)),
        Err(e) => {
            log::error!(target:"app", "Failed to get the app home directory: {}", e);
            Err(anyhow::anyhow!("Failed to get the app homedirectory"))
        }
    }
}