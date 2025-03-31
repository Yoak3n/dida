use once_cell::sync::OnceCell;
use tauri::tray::TrayIconBuilder;
use tauri::{
    menu::MenuEvent,
    App, AppHandle,
};
use anyhow::Result;

// use super::handle;
use crate::{
    utils::resolve,
    feat,
    // utils::logging::Type
};

pub struct Tray {}

impl Tray {
    pub fn global() -> &'static Tray {
        static TRAY: OnceCell<Tray> = OnceCell::new();

        #[cfg(target_os = "macos")]
        return TRAY.get_or_init(|| Tray {
            speed_rate: Arc::new(Mutex::new(None)),
            shutdown_tx: Arc::new(RwLock::new(None)),
            is_subscribed: Arc::new(RwLock::new(false)),
            rate_cache: Arc::new(Mutex::new(None)),
        });

        #[cfg(not(target_os = "macos"))]
        return TRAY.get_or_init(|| Tray {});
    }

    pub fn init(&self) -> Result<()> {
        #[cfg(target_os = "macos")]
        {
            let mut speed_rate = self.speed_rate.lock();
            *speed_rate = Some(SpeedRate::new());
        }
        Ok(())
    }

    pub fn create_systray(&self, app: &App) -> Result<()> {
        let builder = TrayIconBuilder::with_id("main")
            .icon(app.default_window_icon().unwrap().clone())
            .icon_as_template(false);

        #[cfg(any(target_os = "macos", target_os = "windows"))]
        {
            // let tray_event = { Config::verge().latest().tray_event.clone() };
            // let tray_event: String = tray_event.unwrap_or("main_window".into());
            // if tray_event.as_str() != "tray_menu" {
            //     builder = builder.show_menu_on_left_click(false);
            // }
        }

        let tray = builder.build(app)?;

        // tray.on_tray_icon_event(|_, event| {
        //     let tray_event = { Config::verge().latest().tray_event.clone() };
        //     let tray_event: String = tray_event.unwrap_or("main_window".into());
        //     log::debug!(target: "app","tray event: {:?}", tray_event);

        //     if let TrayIconEvent::Click {
        //         button: MouseButton::Left,
        //         button_state: MouseButtonState::Down,
        //         ..
        //     } = event
        //     {
        //         match tray_event.as_str() {
        //             "system_proxy" => feat::toggle_system_proxy(),
        //             "tun_mode" => feat::toggle_tun_mode(None),
        //             "main_window" => resolve::create_window(),
        //             _ => {}
        //         }
        //     }
        // });
        tray.on_menu_event(on_menu_event);
        Ok(())
    }
}

fn on_menu_event(_: &AppHandle, event: MenuEvent) {
    match event.id.as_ref() {
        mode @ ("rule_mode" | "global_mode" | "direct_mode") => {
            let mode = &mode[0..mode.len() - 5];
            println!("change mode to: {}", mode);
            // feat::change_clash_mode(mode.into());
        }
        "open_window" => resolve::create_window(),
        // "system_proxy" => feat::toggle_system_proxy(),
        // "tun_mode" => feat::toggle_tun_mode(None),
        // "copy_env" => feat::copy_clash_env(),
        // "open_app_dir" => crate::logging_error!(Type::Cmd, true, cmd::open_app_dir()),
        // "open_core_dir" => crate::logging_error!(Type::Cmd, true, cmd::open_core_dir()),
        // "open_logs_dir" => crate::logging_error!(Type::Cmd, true, cmd::open_logs_dir()),
        // "restart_clash" => feat::restart_clash_core(),
        // "restart_app" => feat::restart_app(),
        // "entry_lightweight_mode" => entry_lightweight_mode(),
        "quit" => {
            feat::quit(Some(0));
        }
        // id if id.starts_with("profiles_") => {
        //     let profile_index = &id["profiles_".len()..];
        //     feat::toggle_proxy_profile(profile_index.into());
        // }
        _ => {}
    }
}


// fn create_tray_menu(
//     app_handle: &AppHandle,
//     mode: Option<&str>,
//     system_proxy_enabled: bool,
//     tun_mode_enabled: bool,
//     profile_uid_and_name: Vec<(String, String)>,
// ) -> Result<tauri::menu::Menu<Wry>> {
//     let mode = mode.unwrap_or("");
//     let version = VERSION.get().unwrap();
//     let hotkeys = Config::verge()
//         .latest()
//         .hotkeys
//         .as_ref()
//         .map(|h| {
//             h.iter()
//                 .filter_map(|item| {
//                     let mut parts = item.split(',');
//                     match (parts.next(), parts.next()) {
//                         (Some(func), Some(key)) => Some((func.to_string(), key.to_string())),
//                         _ => None,
//                     }
//                 })
//                 .collect::<std::collections::HashMap<String, String>>()
//         })
//         .unwrap_or_default();

//     let profile_menu_items: Vec<CheckMenuItem<Wry>> = profile_uid_and_name
//         .iter()
//         .map(|(profile_uid, profile_name)| {
//             let is_current_profile = Config::profiles()
//                 .data()
//                 .is_current_profile_index(profile_uid.to_string());
//             CheckMenuItem::with_id(
//                 app_handle,
//                 format!("profiles_{}", profile_uid),
//                 t(profile_name),
//                 true,
//                 is_current_profile,
//                 None::<&str>,
//             )
//             .unwrap()
//         })
//         .collect();
//     let profile_menu_items: Vec<&dyn IsMenuItem<Wry>> = profile_menu_items
//         .iter()
//         .map(|item| item as &dyn IsMenuItem<Wry>)
//         .collect();

//     let open_window = &MenuItem::with_id(
//         app_handle,
//         "open_window",
//         t("Dashboard"),
//         true,
//         hotkeys.get("open_or_close_dashboard").map(|s| s.as_str()),
//     )
//     .unwrap();

//     let rule_mode = &CheckMenuItem::with_id(
//         app_handle,
//         "rule_mode",
//         t("Rule Mode"),
//         true,
//         mode == "rule",
//         hotkeys.get("clash_mode_rule").map(|s| s.as_str()),
//     )
//     .unwrap();

//     let global_mode = &CheckMenuItem::with_id(
//         app_handle,
//         "global_mode",
//         t("Global Mode"),
//         true,
//         mode == "global",
//         hotkeys.get("clash_mode_global").map(|s| s.as_str()),
//     )
//     .unwrap();

//     let direct_mode = &CheckMenuItem::with_id(
//         app_handle,
//         "direct_mode",
//         t("Direct Mode"),
//         true,
//         mode == "direct",
//         hotkeys.get("clash_mode_direct").map(|s| s.as_str()),
//     )
//     .unwrap();

//     let profiles = &Submenu::with_id_and_items(
//         app_handle,
//         "profiles",
//         t("Profiles"),
//         true,
//         &profile_menu_items,
//     )
//     .unwrap();

//     let system_proxy = &CheckMenuItem::with_id(
//         app_handle,
//         "system_proxy",
//         t("System Proxy"),
//         true,
//         system_proxy_enabled,
//         hotkeys.get("toggle_system_proxy").map(|s| s.as_str()),
//     )
//     .unwrap();

//     let tun_mode = &CheckMenuItem::with_id(
//         app_handle,
//         "tun_mode",
//         t("TUN Mode"),
//         true,
//         tun_mode_enabled,
//         hotkeys.get("toggle_tun_mode").map(|s| s.as_str()),
//     )
//     .unwrap();

//     let lighteweight_mode = &MenuItem::with_id(
//         app_handle,
//         "entry_lightweight_mode",
//         t("LightWeight Mode"),
//         true,
//         hotkeys.get("entry_lightweight_mode").map(|s| s.as_str()),
//     )
//     .unwrap();

//     let copy_env =
//         &MenuItem::with_id(app_handle, "copy_env", t("Copy Env"), true, None::<&str>).unwrap();

//     let open_app_dir = &MenuItem::with_id(
//         app_handle,
//         "open_app_dir",
//         t("Conf Dir"),
//         true,
//         None::<&str>,
//     )
//     .unwrap();

//     let open_core_dir = &MenuItem::with_id(
//         app_handle,
//         "open_core_dir",
//         t("Core Dir"),
//         true,
//         None::<&str>,
//     )
//     .unwrap();

//     let open_logs_dir = &MenuItem::with_id(
//         app_handle,
//         "open_logs_dir",
//         t("Logs Dir"),
//         true,
//         None::<&str>,
//     )
//     .unwrap();

//     let open_dir = &Submenu::with_id_and_items(
//         app_handle,
//         "open_dir",
//         t("Open Dir"),
//         true,
//         &[open_app_dir, open_core_dir, open_logs_dir],
//     )
//     .unwrap();

//     let restart_clash = &MenuItem::with_id(
//         app_handle,
//         "restart_clash",
//         t("Restart Clash Core"),
//         true,
//         None::<&str>,
//     )
//     .unwrap();

//     let restart_app = &MenuItem::with_id(
//         app_handle,
//         "restart_app",
//         t("Restart App"),
//         true,
//         None::<&str>,
//     )
//     .unwrap();

//     let app_version = &MenuItem::with_id(
//         app_handle,
//         "app_version",
//         format!("{} {version}", t("Verge Version")),
//         true,
//         None::<&str>,
//     )
//     .unwrap();

//     let more = &Submenu::with_id_and_items(
//         app_handle,
//         "more",
//         t("More"),
//         true,
//         &[restart_clash, restart_app, app_version],
//     )
//     .unwrap();

//     let quit =
//         &MenuItem::with_id(app_handle, "quit", t("Exit"), true, Some("CmdOrControl+Q")).unwrap();

//     let separator = &PredefinedMenuItem::separator(app_handle).unwrap();

//     let menu = tauri::menu::MenuBuilder::new(app_handle)
//         .items(&[
//             open_window,
//             separator,
//             rule_mode,
//             global_mode,
//             direct_mode,
//             separator,
//             profiles,
//             separator,
//             system_proxy,
//             tun_mode,
//             separator,
//             lighteweight_mode,
//             copy_env,
//             open_dir,
//             more,
//             separator,
//             quit,
//         ])
//         .build()
//         .unwrap();
//     Ok(menu)
// }



