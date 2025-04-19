import React, { useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import {Card, List, Avatar,Button,FloatButton, message } from 'antd';

import {TaskView,Action} from '../types'


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
    command: 'c:\\',
    args: ['-n', 'test'],
    desc: 'test',
    wait:0,
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
        title:'任务 1',
        description:'关闭MuMu模拟器',
        actions:[close_mumu_action],
        completed:false,
        createdAt:new Date(),
        dueDate:new Date(),
        avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=task1'
    },{
        title: '任务 2',
        description: '实现自定义标题栏',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=task2',
        actions:[test_action2],
        completed: false,
        createdAt: new Date(),
        dueDate: new Date(),
    },{
        title: '任务 3',
        description: '添加页面导航功能',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=task3',
        actions:[test_action5],
        completed: false,
        createdAt: new Date(),
        dueDate: new Date(),
    },{
        title: '任务 4',
        description: '早起学习',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=task4',
        actions:[test_action3,test_action4],
        completed: false,
        createdAt: new Date(),
        dueDate: new Date(),
    },
]


const Home: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const handleClick = useCallback(async(actions:Action[]) => {
        // console.log('Button clicked!', desc);
        try{
            const res = await invoke('execute_actions',{actions:actions})
            console.log(res);
            
            messageApi.open({
                type: 'success',
                content: res as string,
                duration: 2,
            });
        }catch(err){
            console.log(err);
            
            messageApi.open({
                type: 'error',
                content: err as string,
                duration: 2,
            });
        }
        
    },[messageApi]);
    return (
        <>
            {contextHolder} 
            <Card title="今日任务" style={{ marginTop: 16 }}>
                <List
                    itemLayout="horizontal"
                    dataSource={test_tasks}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={item.avatar} />}
                                title={<Button color="default" variant="text" onClick={
                                    (e)=>{
                                        e.stopPropagation()
                                        handleClick(item.actions)
                                    }
                                    }>
                                        {item.title}
                                        </Button>}
                                description={item.description}
                            />
                        </List.Item>
                    )}
                />
            </Card>
            <FloatButton onClick={()=>{console.log('FloatButton clicked!')}}/>
        </>
    )

}

export default Home