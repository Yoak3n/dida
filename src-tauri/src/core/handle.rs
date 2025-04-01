use once_cell::sync::OnceCell;
use parking_lot::RwLock;
use std::sync::Arc;
use tauri::{AppHandle, Manager, WebviewWindow};
use tauri_plugin_notification::NotificationExt;

/// 存储启动期间的错误消息
#[derive(Debug, Clone)]
struct ErrorMessage {
    status: String,
    message: String,
}

#[derive(Debug, Default, Clone)]
pub struct Handle {
    pub app_handle: Arc<RwLock<Option<AppHandle>>>,
    pub is_exiting: Arc<RwLock<bool>>,
    startup_errors: Arc<RwLock<Vec<ErrorMessage>>>,
    startup_completed: Arc<RwLock<bool>>,
}

impl Handle {
    pub fn global() -> &'static Handle {
        static HANDLE: OnceCell<Handle> = OnceCell::new();

        HANDLE.get_or_init(|| Handle {
            app_handle: Arc::new(RwLock::new(None)),
            is_exiting: Arc::new(RwLock::new(false)),
            startup_errors: Arc::new(RwLock::new(Vec::new())),
            startup_completed: Arc::new(RwLock::new(false)),
        })
    }
    pub fn init(&self, app_handle: &AppHandle) {
        let mut handle = self.app_handle.write();
        *handle = Some(app_handle.clone());
    }

    pub fn is_exiting(&self) -> bool {
        *self.is_exiting.read()
    }
    pub fn set_is_exiting(&self) {
        let mut is_exiting = self.is_exiting.write();
        *is_exiting = true;
    }

    pub fn app_handle(&self) -> Option<AppHandle> {
        self.app_handle.read().clone()
    }

    pub fn get_window(&self) -> Option<WebviewWindow> {
        let app_handle = self.app_handle().unwrap();
        let window: Option<WebviewWindow> = app_handle.get_webview_window("main");
        if window.is_none() {
            // log::debug!(target:"app", "main window not found");
            return None;
        }
        window
    }
    pub fn get_window_visible(&self) -> bool {
        let window = self.get_window();
        match window {
            Some(window) => window.is_visible().unwrap(),
            None => false,
        }
    }

    pub fn notice_message<S: Into<String>, M: Into<String>>(status: S, msg: M) {
        let handle = Self::global();
        let status_str = status.into();
        let msg_str = msg.into();
        if !*handle.startup_completed.read() {
            // logging!(
            //     info,
            //     Type::Frontend,
            //     true,
            //     "启动过程中发现错误，加入消息队列: {} - {}",
            //     status_str,
            //     msg_str
            // );

            // 将消息添加到启动错误队列
            let mut errors = handle.startup_errors.write();
            errors.push(ErrorMessage {
                status: status_str,
                message: msg_str,
            });
            return;
        }
        handle
            .app_handle()
            .unwrap()
            .notification()
            .builder()
            .title(&status_str)
            .body(&msg_str)
            .show()
            .unwrap();
    }
}
