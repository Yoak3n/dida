import React from "react";
import { invoke } from "@tauri-apps/api/core";
import {Card, List, Avatar,Button,FloatButton } from 'antd';

import {Action} from '../types/index'


const test_action:Action = {
    typ:'open_dir',
    name:'test',
    command: 'C:\\',
    args: ['-n', 'test'],
    desc: 'test',
}

const Home: React.FC = () => {
    const data = [
        {
            title: '任务 1',
            description: '完成应用框架搭建',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=task1',
        },
        {
            title: '任务 2',
            description: '实现自定义标题栏',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=task2',
        },
        {
            title: '任务 3',
            description: '添加页面导航功能',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=task3',
        },
    ];
    const handleClick = async(desc:string) => {
        console.log('Button clicked!', desc);
        invoke('execute_action',{act:test_action})
    };
    return (
        <div>
            <Card title="今日任务" style={{ marginTop: 16 }}>
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={item.avatar} />}
                                title={<Button color="default" variant="text" onClick={
                                    (e)=>{
                                        e.stopPropagation()
                                        handleClick(item.description)
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