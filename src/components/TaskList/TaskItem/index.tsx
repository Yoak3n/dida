import React,{useContext} from "react";

import { Button, Tooltip, Checkbox, Card, Space, Avatar,Typography, Tag } from "antd";
import type { CheckboxChangeEvent } from "antd";
import type { TaskView } from "@/types";
import dayjs from "dayjs";
import { ClockCircleOutlined } from "@ant-design/icons";

import { executeActions } from "@/utils";
import Msg from "@/components/Context/Msg";
import { MessageInstance } from "antd/es/message/interface";
const { Text } = Typography;

interface TaskItemProps {
    task: TaskView,
    onStatusChange?: (taskId: number, completed: boolean) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task,onStatusChange }) => {
    const {messageApi}= useContext(Msg) as { messageApi: MessageInstance; contextHolder: React.ReactNode }
    const formatDueDate = (date: Date) => {
        return dayjs(date).format('YYYY-MM-DD');
    };
    const isOverdue = () => {
        return dayjs().isAfter(dayjs(task.dueDate)) && !task.completed;
    };
    const handleStatusChange = (e: CheckboxChangeEvent) => {
        const newStatus = e.target.checked;
        if (onStatusChange && task.id !== undefined) {
            onStatusChange(task.id, newStatus);
        }
    };
    const handleExecuteActions = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (task.actions && task.actions.length > 0) {
            executeActions(task.actions)
            .then((res) => {
                console.log(res)
                messageApi.open({
                    type:'success',
                    content: res==null  ? '执行成功' : res,
                    duration: 2,
                });
            })
            .catch((err) => {
                messageApi.open({
                    type: 'error',
                    content: err as string,
                    duration: 2,
                });
            });
        }
    };
    return (
        <Card 
        className="task-item-card" 
        hoverable 
        style={{ 
            marginBottom: 16,
            width: 'calc(100% - 8px)', 
            borderLeft: task.completed ? '4px solid #52c41a' : isOverdue() ? '4px solid #f5222d' : '4px solid #1890ff'
        }}
        >
            <div className="task-item-content" style={{ display: 'flex', alignItems: 'flex-start' }}>
                <Checkbox
                    checked={task.completed}
                    onChange={handleStatusChange}
                    style={{ marginRight: 12, marginTop: 4 }}
                />
                
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Space style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {task.avatar && (
                                <Avatar src={task.avatar} size="small" />
                            )}
                            <Tooltip title={task.desc} placement="topLeft">
                                <Text 
                                    strong 
                                    style={{ 
                                        fontSize: 16,
                                        textDecoration: task.completed ? 'line-through' : 'none',
                                        color: task.completed ? '#8c8c8c' : 'inherit',
                                        maxWidth: '150px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        display: 'inline-block'
                                    }}
                                >
                                    {task.name}
                                </Text>
                            </Tooltip>
                        </Space>
                        
                        <Space>
                            {task.actions && task.actions.length > 0 && (
                                <Button 
                                    type="link" 
                                    size="small" 
                                    onClick={handleExecuteActions}
                                >
                                    执行
                                </Button>
                            )}
                            
                            <Tag 
                                color={isOverdue() ? 'error' : 'default'} 
                                icon={<ClockCircleOutlined />}
                            >
                                {formatDueDate(task.dueDate)}
                            </Tag>
                        </Space>
                    </div>
                    
                    {task.actions && task.actions.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                            <Tooltip placement="bottom" title={task.actions.map(item=>item.name + " ")}>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    关联操作: {task.actions.length}
                                </Text>
                            </Tooltip>

                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}

export default TaskItem;
