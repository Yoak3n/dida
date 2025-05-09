import { Action } from "@/types";
import { invoke } from "@tauri-apps/api/core";

const simplifyPath = (path:string) => {
    if (!path) return '';
    const separator = path.includes('\\') ? '\\' : '/';
    const parts = path.split(separator);
    const filename = parts[parts.length - 1];
    if (parts.length > 4) {
      return parts[0] + separator + '...' + separator + parts[parts.length - 2] + separator + filename;
    }
    
    return path;
};

const executeActions = async (actions: Action[]):Promise<string> => invoke('execute_actions',{actions})

export { simplifyPath, executeActions };