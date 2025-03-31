use once_cell::sync::OnceCell;
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder};
use tauri::{Manager,Wry};
use tauri::{
    menu::{MenuEvent,MenuItem,Menu,PredefinedMenuItem},
    App, AppHandle,
};
use anyhow::Result;

// use super::handle;
use crate::{
    utils::resolve,
    feat,
    core::handle
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
    pub fn update_menu(&self) -> Result<()> {
        let app_handle = handle::Handle::global().app_handle().unwrap();
    
        let tray = app_handle.tray_by_id("main").unwrap();
        let _ = tray.set_menu(Some(create_tray_menu(
            &app_handle,handle::Handle::global().get_window_visible()
        )?));
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
        tray.on_tray_icon_event(|tray_handle, event| {
            let app_handle = tray_handle.app_handle();
            match event {
                tauri::tray::TrayIconEvent::Click { 
                    button, 
                    button_state,
                    ..
                }=>{
                    if button_state == MouseButtonState::Down{
                        match button {
                            MouseButton::Right =>{
                                
                            }
                            _ =>{} 
                        }
                    }
                }  
                tauri::tray::TrayIconEvent::DoubleClick {  
                    button, 
                    ..
                } =>{
                    if button == MouseButton::Left {
                        if let Some(main_window) = app_handle.get_webview_window("main") {
                            if let Ok(visible) = main_window.is_visible() {
                                if visible {
                                    main_window.close().unwrap();
                                } else {
                                    main_window.show().unwrap();
                                    main_window.set_focus().unwrap();
                                }
                            }
                        }else{
                            resolve::create_window();
                        }
                    }
                }
                _ => {}
            }
        });
        
        let menu = create_tray_menu(app.app_handle(),handle::Handle::global().get_window_visible())?;
        tray.set_menu(Some(menu))?;
        tray.on_menu_event(on_menu_event);
        Ok(())
    }
}

fn create_tray_menu(app_handle: &AppHandle,visiable:bool) ->Result<Menu<Wry>>{
    let version = resolve::VERSION.get().unwrap();
    let app_version = &MenuItem::with_id(
        app_handle,
        "app_version",
        format!("{version}"),
        false,
        None::<&str>,
    ).unwrap();
    let show = {
        if visiable {
            &MenuItem::with_id(app_handle, "open_window", "Hide", true, None::<&str>).unwrap() 
        }else{
            &MenuItem::with_id(app_handle, "open_window", "Show", true, None::<&str>).unwrap()
        }
    };
    let separator = &PredefinedMenuItem::separator(app_handle).unwrap();
    let quit =
        &MenuItem::with_id(app_handle, "quit", "Exit", true, Some("CmdOrControl+Q")).unwrap();

    let menu = tauri::menu::MenuBuilder::new(app_handle)
        .items(&[
            app_version,
            separator,
            show,
            quit,
        ])
        .build()
        .unwrap();
    Ok(menu)

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




