import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Switch, Card, message, Select } from 'antd';
import type { Task, Action } from '../types';
import { invoke } from '@tauri-apps/api/core';
import dayjs from 'dayjs';

interface TaskModifyProps {
    task?: Task;
    onSubmit?: () => void;
}

const getActions = async () => {
    try {
        const actions = await invoke('get_all_actions');
        return actions as Action[];
    } catch (error) {
        console.error('Error fetching actions:', error);
        return [];
    }
}

const TaskModify: React.FC<TaskModifyProps> = ({ task, onSubmit }) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const initialValues = task ? {
        ...task,
        dueDate: task.dueDate ? dayjs(task.dueDate) : undefined,
        createdAt: task.createdAt ? dayjs(task.createdAt) : undefined,
    } : {
        name: '',
        desc: '',
        completed: false,
        actions: [],
        parent_id: undefined,
        createdAt: dayjs(),
        dueDate: undefined,
    };

    const handleSubmit = async (values: any) => {
        try {
            const taskData = {
                ...values,
                dueDate: values.dueDate?.toDate(),
                createdAt: values.createdAt.toDate(),
            };

            const method = task?.id ? 'update_task' : 'create_task';
            await invoke(method, { task: taskData });
            
            messageApi.success('任务保存成功！');
            onSubmit?.();
        } catch (error) {
            messageApi.error('保存失败：' + error);
        }
    };

    return (
        <>
            {contextHolder}
            <Card title={task ? "编辑任务" : "创建任务"}>
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={initialValues}
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="任务名称"
                        rules={[{ required: true, message: '请输入任务名称' }]}
                    >
                        <Input placeholder="请输入任务名称" />
                    </Form.Item>

                    <Form.Item
                        name="desc"
                        label="任务描述"
                    >
                        <Input.TextArea rows={4} placeholder="请输入任务描述" />
                    </Form.Item>

                    <Form.Item
                        name="parent_id"
                        label="父任务"
                    >
                        <Input placeholder="父任务ID（可选）" />
                    </Form.Item>

                    <Form.Item
                        name="completed"
                        label="完成状态"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item
                        name="actions"
                        label="关联动作"
                    >
                        <Select
                            mode="multiple"
                            placeholder="选择关联动作"
                            style={{ width: '100%' }}
                            onFocus={async () => {
                                const actions = await getActions();
                                form.setFieldsValue({ actions: actions.map(action => action.id) });
                            }}
                            options={form.getFieldValue('actions')}
                        />
                    </Form.Item>

                    <Form.Item
                        name="dueDate"
                        label="截止日期"
                        rules={[{ required: true, message: '请选择截止日期' }]}
                    >
                        <DatePicker 
                            showTime 
                            style={{ width: '100%' }} 
                            placeholder="选择截止日期"
                        />
                    </Form.Item>

                    <Form.Item
                        name="createdAt"
                        label="创建时间"
                        hidden={!task}
                    >
                        <DatePicker 
                            showTime 
                            style={{ width: '100%' }} 
                            disabled
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            {task ? '保存修改' : '创建任务'}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </>
    );
};

export default TaskModify;