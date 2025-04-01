use crate::core::handle;

#[cfg(desktop)]
pub fn quit(code: Option<i32>) {
    // log::debug!(target: "app", "启动退出流程");
    println!("启动退出流程");

    // 获取应用句柄并设置退出标志
    let app_handle = handle::Handle::global().app_handle().unwrap();
    handle::Handle::global().set_is_exiting();

    // 优先关闭窗口，提供立即反馈
    if let Some(window) = handle::Handle::global().get_window() {
        let _ = window.hide();
    }

    // 在单独线程中处理资源清理，避免阻塞主线程
    std::thread::spawn(move || {
        // 使用tokio运行时执行异步清理任务
        // tauri::async_runtime::block_on(async {
        //     // 使用超时机制处理清理操作
        //     use tokio::time::{timeout, Duration};

        //     // 1. 直接关闭TUN模式 (优先处理，通常最容易卡住)
        //     if Config::verge().data().enable_tun_mode.unwrap_or(false) {
        //         let disable = serde_json::json!({
        //             "tun": {
        //                 "enable": false
        //             }
        //         });

        //         // 设置1秒超时
        //         let _ = timeout(
        //             Duration::from_secs(1),
        //             MihomoManager::global().patch_configs(disable),
        //         )
        //         .await;
        //     }

        //     // 2. 并行处理系统代理和核心进程清理
        //     let proxy_future = timeout(
        //         Duration::from_secs(1),
        //         sysopt::Sysopt::global().reset_sysproxy(),
        //     );

        //     let core_future = timeout(Duration::from_secs(1), CoreManager::global().stop_core());

        //     // 同时等待两个任务完成
        //     let _ = futures::join!(proxy_future, core_future);

        //     // 3. 处理macOS特定清理
        //     #[cfg(target_os = "macos")]
        //     {
        //         let _ = timeout(Duration::from_millis(500), resolve::restore_public_dns()).await;
        //     }
        // });

        // 无论清理结果如何，确保应用退出
        app_handle.exit(code.unwrap_or(0));
    });
}
