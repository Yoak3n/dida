import React from "react";
import { invoke } from "@tauri-apps/api/core";
import { Typography, Card, List, Avatar,Button } from 'antd';

import {Action} from '../types/index'


const test_action:Action = {
    typ:'test',
    name:'test',
    command: 'E:/IDE/Trae',
    args: ['-n', 'test'],
    desc: 'test',
}

const { Title, Paragraph } = Typography;
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
            <Title level={2}>欢迎使用 DiDa 应用</Title>
            <Paragraph>这是一个使用 Tauri 和 React 构建的桌面应用程序。</Paragraph>

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
        </div>
    )

}

export default Home