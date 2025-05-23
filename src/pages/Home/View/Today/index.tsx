import { useCallback,useContext, useEffect, useState } from 'react';
import {Card, List, Avatar,Button } from 'antd';
import { invoke } from "@tauri-apps/api/core";
import Msg from "@/components/Context/Msg";

import {TaskView,Action} from '@/types'
import TaskList from '@/components/TaskList';


const test_action1:Action = {
    typ:'open_url',
    name:'打开百度',
    command: 'www.baidu.com',
    args: ['-n', 'test'],
    desc: 'test',
    wait:0,
}
const test_action2:Action = {
    typ:'open_dir',
    name:'打开C盘',
    command: 'C:\\',
    args: ['-n', 'test'],
    desc: 'test',
    wait:1,
    retry: 0
}
const test_action3:Action = {
    typ:'open_file',
    name:'打开文件',
    command: 'E:\\Application\\MuMuPlayer-12.0\\shell\\MuMuPlayer.exe',
    desc: '打开mumu模拟器',
    wait:2000,
}
const test_action4:Action = {
   typ: 'exec_command',
   name: '执行命令',
   command: 'maa',
   args: ['run','start'], 
   desc: 'test',
   wait:1,
}
const test_action5:Action = {
    typ: 'exec_command',
    name: '执行命令',
    command: 'maa',
    args: ['run','morning'], 
    desc: 'test',
    wait:1,
}

const close_mumu_action: Action = {
    typ: 'exec_command',
    name: '关闭MuMu模拟器',
    command: 'taskkill',
    args: ['/F', '/IM', 'MuMuPlayer.exe'], 
    desc: '强制关闭MuMu模拟器进程',
    wait: 0,
}
const test_tasks:TaskView[]=[
    {
        id: 1,
        name:'任务 1',
        desc:'关闭MuMu模拟器',
        actions:[test_action1],
        completed:false,
        createdAt:new Date(),
        dueDate:new Date(),
        avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=task1'
    },{
        id: 2,
        name: '任务 2',
        desc: '实现自定义标题栏',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=task2',
        actions:[test_action2],
        completed: false,
        createdAt: new Date(),
        dueDate: new Date(),
    },{
        id: 3,
        name: '任务 3',
        desc: '添加页面导航功能',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=task3',
        actions:[test_action5],
        completed: false,
        createdAt: new Date(),
        dueDate: new Date(),
    },{
        id: 4,
        name: '任务 4',
        desc: '早起学习',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=task4',
        actions:[test_action3,test_action4],
        completed: false,
        createdAt: new Date(),
        dueDate: new Date(2025, 5, 20),
    },
]

const Today:React.FC = () => {
    const [tasksList,setTaskList]  = useState<TaskView[]>([]);
    useEffect(() => {
        // invoke('get_tasks',{completed:false})
        // .then((res) => {
        //     setTaskList(res as TaskView[]);
        // })
        // .catch((err) => {
        //     console.error(err);
        // });
        setTaskList(test_tasks);
    }, []);
    // const MsgContext = useContext(Msg);
    // const handleClick = useCallback(async(actions:Action[]) => {
    //     // console.log('Button clicked!', desc);
    //     try{
    //         const res = await invoke('execute_actions',{actions:actions})
    //         MsgContext?.messageApi.open({
    //             type: 'success',
    //             content: res as string,
    //             duration: 2,
    //         });
    //     }catch(err){
    //         MsgContext?.messageApi.open({
    //             type: 'error',
    //             content: err as string,
    //             duration: 2,
    //         });
    //     }
    // },[MsgContext?.messageApi]);

    const changeTaskStatus = (taskId:number,newStatus:boolean) => {
        const newTasks = tasksList.map((task) => {
            if (task.id === taskId) {
                return { ...task, completed: newStatus };
            }
            return task;
        });
        setTaskList(newTasks);
    }
    return (
        <>
            <Card title="今日任务" style={{ marginTop: 16 }}>
                <TaskList tasks={tasksList} onChange={changeTaskStatus} />
            </Card>

        </>
    )

}
export default Today