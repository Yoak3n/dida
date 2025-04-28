import React from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "antd";

import type { Action } from "../../types";
const SubmitAction = async(act:Action) => {
    console.log(act);
    const res:string = await invoke("create_action", { action: act });
    console.log(res);
}
type PropsType = {data:Action}
const  SubmitActionButton:React.FC<PropsType> = ({data}) =>{ 

    return (
        <div className="submit-action">
            <Button type="primary" onClick={() => SubmitAction(data)}>
                Submit
            </Button>
        </div>
    )
}

export default SubmitActionButton;