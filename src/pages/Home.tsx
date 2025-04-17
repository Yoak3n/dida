import React from "react";
import { invoke } from "@tauri-apps/api/core";
import {Card, List, Avatar,Button,FloatButton } from 'antd';

import {TaskView,Action} from '../types'


const test_action1:Action = {
    typ:'open_url',
    name:'打开百度',
    command: 'www.baidu.com',
    args: ['-n', 'test'],
    desc: 'test',
}
const test_action2:Action = {
    typ:'open_dir',
    name:'打开C盘',
    command: 'c:\\',
    args: ['-n', 'test'],
    desc: 'test',
}
const test_action3:Action = {
    typ:'open_file',
    name:'打开文件',
    command: 'c:\\Users\\Yoake\\Desktop\\Diagnostics-1728806255.log',
    args: ['-n', 'test'],
    desc: 'test',
}
const test_action4:Action = {
   typ: 'exec_command',
   name: '执行命令',
   command: 'git',
   args: ['status'], 
   desc: 'test',
}
const test_tasks:TaskView[]=[
    {
        title:'任务 1',
        description:'完成应用框架搭建',
        actions:[test_action1],
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
        actions:[test_action3],
        completed: false,
        createdAt: new Date(),
        dueDate: new Date(),
    },{
        title: '任务 4',
        description: '添加页面导航功能',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=task4',
        actions:[test_action4],
        completed: false,
        createdAt: new Date(),
        dueDate: new Date(),
    },
]


const Home: React.FC = () => {
    // const data = [
    //     {
    //         title: '任务 1',
    //         description: '完成应用框架搭建',
    //         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=task1',
    //     },
    //     {
    //         title: '任务 2',
    //         description: '实现自定义标题栏',
    //         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=task2',
    //     },
    //     {
    //         title: '任务 3',
    //         description: '添加页面导航功能',
    //         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=task3',
    //     },
    // ];
    const handleClick = async(actions:Action[]) => {
        // console.log('Button clicked!', desc);
        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            invoke('execute_action',{act:action})
        }
    };
    return (
        <div>
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
        </div>
    )

}

export default Home