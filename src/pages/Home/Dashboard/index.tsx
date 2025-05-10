import React, { useState, useEffect, useContext } from "react";
import { Card, List, Typography, Button, Space, Tag, Tooltip } from "antd";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";
import type { Action } from "@/types";
import { executeActions } from "@/utils";
import Msg from "@/components/Context/Msg";
import { MessageInstance } from "antd/es/message/interface";
import "./style.css"; // 添加样式文件引用

const { Text, Title } = Typography;

const Dashboard: React.FC = () => {
    const [actions, setActions] = useState<Action[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { messageApi } = useContext(Msg) as { messageApi: MessageInstance; contextHolder: React.ReactNode };
    const navigate = useNavigate();

    useEffect(() => {
        fetchActions();
    }, []);

    const fetchActions = async () => {
        setLoading(true);
        try {
            const result = await invoke('get_all_actions');
            setActions(result as Action[]);
        } catch (error) {
            messageApi.error('获取 actions 列表失败');
        } finally {
            setLoading(false);
        }
    };

    const handleExecute = async (action: Action, e: React.MouseEvent) => {
        e.stopPropagation(); // 阻止事件冒泡，避免触发跳转
        try {
            const result = await executeActions([action]);
            messageApi.success(result || '执行成功');
        } catch (error) {
            messageApi.error(error as string);
        }
    };

    const handleEditAction = (action: Action) => {
        // 跳转到 action 修改页面，并传递 action ID
        navigate(`/action/edit/${action.id}`);
    };

    return (
        <>
            <Card
                style={{height:'100%' }}
                title={<Button onClick={fetchActions} type="link"><Title level={4} >Actions 列表</Title></Button>}
                // extra={<Button type="primary" onClick={fetchActions}>刷新</Button>}
                loading={loading}
            >
                <List
                    grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 6 }}
                    dataSource={actions}
                    locale={{ emptyText: '暂无 Actions' }}
                    renderItem={(action) => (
                        <List.Item>
                            <Card
                                className="action-card"
                                size="small"
                                hoverable
                                onClick={() => handleEditAction(action)}
                                title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Tooltip title={action.name}>
                                            <Text
                                                strong
                                                ellipsis
                                                style={{ maxWidth: '70%' }}
                                            >
                                                {action.name}
                                            </Text>
                                        </Tooltip>
                                        <Tag color="blue">{action.typ}</Tag>
                                    </div>
                                }
                                extra={
                                    <Button
                                        type="link"
                                        size="small"
                                        onClick={(e) => handleExecute(action, e)}
                                        style={{ padding: '0 4px' }}
                                    >
                                        测试
                                    </Button>
                                }
                            >
                                <Tooltip title={action.desc || '无描述'}>
                                    <Typography.Paragraph
                                        type="secondary"
                                        ellipsis={{
                                            rows: 1,
                                            expandable: true,
                                            onEllipsis: (ellipsis) => {
                                                console.log('Ellipsis changed:', ellipsis);
                                            },
                                        }}
                                        style={{ fontSize: '12px', margin: 0 }}
                                    >
                                        {action.desc || '无描述'}
                                    </Typography.Paragraph>
                                </Tooltip>
                            </Card>
                        </List.Item>
                    )}
                    pagination={{
                        pageSize: 12,
                        hideOnSinglePage: true,
                        size: 'small'
                    }}
                />
            </Card>
        </>
    );
};

export default Dashboard;