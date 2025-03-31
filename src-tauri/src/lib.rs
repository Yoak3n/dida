mod core;
mod utils;
mod feat;
mod config;

use std::sync::{Mutex, Once};

use tauri::AppHandle;
use tauri_plugin_notification::NotificationExt;
use tauri_plugin_single_instance;

// use utils::logging::Type;
use utils::resolve;

pub struct AppHandleManager {
    inner: Mutex<Option<AppHandle>>,
    init: Once,
}

impl AppHandleManager {
    /// Get the global instance of the app handle manager.
    pub fn global() -> &'static Self {
        static INSTANCE: AppHandleManager = AppHandleManager {
            inner: Mutex::new(None),
            init: Once::new(),
        };
        &INSTANCE
    }

    /// Initialize the app handle manager with an app handle.
    pub fn init(&self, handle: AppHandle) {
        self.init.call_once(|| {
            let mut app_handle = self.inner.lock().unwrap();
            *app_handle = Some(handle);
        });
    }

    /// Get the app handle if it has been initialized.
    pub fn get(&self) -> Option<AppHandle> {
        self.inner.lock().unwrap().clone()
    }

    /// Get the app handle, panics if it hasn't been initialized.
    pub fn get_handle(&self) -> AppHandle {
        self.get().expect("AppHandle not initialized")
    }

    pub fn set_activation_policy_regular(&self) {
        #[cfg(target_os = "macos")]
        {
            let app_handle = self.inner.lock().unwrap();
            let app_handle = app_handle.as_ref().unwrap();
            let _ = app_handle.set_activation_policy(tauri::ActivationPolicy::Regular);
        }
    }

    pub fn set_activation_policy_accessory(&self) {
        #[cfg(target_os = "macos")]
        {
            let app_handle = self.inner.lock().unwrap();
            let app_handle = app_handle.as_ref().unwrap();
            let _ = app_handle.set_activation_policy(tauri::ActivationPolicy::Accessory);
        }
    }

    pub fn set_activation_policy_prohibited(&self) {
        #[cfg(target_os = "macos")]
        {
            let app_handle = self.inner.lock().unwrap();
            let app_handle = app_handle.as_ref().unwrap();
            let _ = app_handle.set_activation_policy(tauri::ActivationPolicy::Prohibited);
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_single_instance::init(|app, _, _| {
            app.notification()
                .builder()
                .title("The program is already running. Please do not start it again!")
                .icon("dida")
                .show()
                .unwrap();
        }))
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            tauri::async_runtime::block_on(async move {
                resolve::resolve_setup(app).await;
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![]);
    let app = builder
        .build(tauri::generate_context!())
        .expect("error while running tauri application");
    app.run(|app_handle,e|match e{
        tauri::RunEvent::Ready | tauri::RunEvent::Resumed => {
            AppHandleManager::global().init(app_handle.clone());
            #[cfg(target_os = "macos")]
            {
                if let Some(window) = AppHandleManager::global()
                    .get_handle()
                    .get_webview_window("main")
                {
                    let _ = window.set_title("Clash Verge");
                }
            }
        }
        #[cfg(target_os = "macos")]
        tauri::RunEvent::Reopen {
            has_visible_windows,
            ..
        } => {
            if !has_visible_windows {
                AppHandleManager::global().set_activation_policy_regular();
            }
            AppHandleManager::global().init(app_handle.clone());
        }
        tauri::RunEvent::ExitRequested { api, code, .. } => {
            if code.is_none() {
                api.prevent_exit();
            }
        }
        tauri::RunEvent::WindowEvent { label, event, .. } => {
            if label == "main" {
                match event {
                    tauri::WindowEvent::CloseRequested { api, .. } => {
                        #[cfg(target_os = "macos")]
                        AppHandleManager::global().set_activation_policy_accessory();
                        if core::handle::Handle::global().is_exiting() {
                            return;
                        }
                        println!("closing window...");
                        api.prevent_close();
                        let window = core::handle::Handle::global().get_window().unwrap();
                        let _ = window.hide();
                    }
                    tauri::WindowEvent::Focused(true) => {
                        #[cfg(target_os = "macos")]
                        {
                            log_err!(hotkey::Hotkey::global().register("CMD+Q", "quit"));
                            log_err!(hotkey::Hotkey::global().register("CMD+W", "hide"));
                        }

                        #[cfg(not(target_os = "macos"))]
                        {
                            // log_err!(hotkey::Hotkey::global().register("Control+Q", "quit"));
                        };
                        {
                            // TODO: 暂时不支持全局热键
                            // let is_enable_global_hotkey = Config::verge()
                            //     .latest()
                            //     .enable_global_hotkey
                            //     .unwrap_or(true);
                            // if !is_enable_global_hotkey {
                            //     log_err!(hotkey::Hotkey::global().init())
                            // }
                        }
                    }
                    tauri::WindowEvent::Focused(false) => {
                        #[cfg(target_os = "macos")]
                        {
                            log_err!(hotkey::Hotkey::global().unregister("CMD+Q"));
                            log_err!(hotkey::Hotkey::global().unregister("CMD+W"));
                        }
                        #[cfg(not(target_os = "macos"))]
                        {
                            // log_err!(hotkey::Hotkey::global().unregister("Control+Q"));
                        };
                        {
                            // TODO: 暂时不支持全局热键
                            // let is_enable_global_hotkey = Config::verge()
                            //     .latest()
                            //     .enable_global_hotkey
                            //     .unwrap_or(true);
                            // if !is_enable_global_hotkey {
                            //     log_err!(hotkey::Hotkey::global().reset())
                            // }
                        }
                    }
                    tauri::WindowEvent::Destroyed => {
                        #[cfg(target_os = "macos")]
                        {
                            log_err!(hotkey::Hotkey::global().unregister("CMD+Q"));
                            log_err!(hotkey::Hotkey::global().unregister("CMD+W"));
                        }

                        #[cfg(not(target_os = "macos"))]
                        {
                            // log_err!(hotkey::Hotkey::global().unregister("Control+Q"));
                        };
                    }
                    _ => {}
                }
            }
        }
        _ => {}
    })
;
}
