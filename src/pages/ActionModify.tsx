import React from 'react';

import { UploadOutlined } from '@ant-design/icons';
import { Form, Input, Select, InputNumber, Button, Tag, Typography, Tooltip } from "antd";
import { invoke } from '@tauri-apps/api/core';

import type { Action, ActionType } from "../types";
// import SubmitActionButton from '../components/Invoke/SubmitAction';
import {simplifyPath} from '@/utils'
const { Paragraph } = Typography;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const ActionModify: React.FC = () => {
    const [form] = Form.useForm();
    
    const initialValues: Action = {
        name: "",
        desc: "",
        command: "",
        args: [],
        typ: "open_file",
        wait: 1,
        retry: 0,
    };

    const actionTypeOptions = [
        { value: "open_file", label: "Open File" },
        { value: "exec_command", label: "Execute Command" },
        { value: "open_dir", label: "Open Directory" },
        { value: "open_url", label: "Open URL" },
    ];

    const handleSelectTypeChange = (value: ActionType) => {
        switch (value) {
            case "open_file":
                form.setFieldsValue({ note: 'Hi, man!' });
                break;
            case "exec_command":
                // Handle click type change
                break;
            case "open_dir":
                break;
            case "open_url":
                break;
            default:
                break;
        }
    };

    const handleSubmit = (values: Action) => {
        console.log('Form values:', values);
        // 这里可以处理表单提交逻辑
    };

    interface TypeConfig {
        [key: string]: {
            label: string;
            component: JSX.Element;
        };
    }

    // 自定义文件选择器组件
    const FileSelector: React.FC<{
        value?: string;
        onChange?: (value: string) => void;
        isFile: boolean;
    }> = ({ value, onChange, isFile }) => {
        const handleSelect = async () => {
            const path: string = await invoke('select_file', { file: isFile });
            onChange?.(path);
        };
    
        return (
            <div>
                <Button icon={<UploadOutlined />} onClick={handleSelect}>
                    {isFile ? '选择文件' : '选择目录'}
                </Button>
                {value && (
                    <div style={{ marginTop: 8 }}>
                        <Tooltip title={value} arrow={false} placement='right'>
                            <Tag style={{ maxWidth: 400 }} color="blue" closable onClose={(e) => {
                                e.preventDefault();
                                onChange?.('');
                            }}>
                                <Paragraph ellipsis={true} style={{ margin: 0 }}>
                                    {simplifyPath(value)}
                                </Paragraph>
                            </Tag>
                        </Tooltip>
                    </div>
                )}
            </div>
        );
    };
    
    // 然后在 renderCommandInput 中使用
    const renderCommandInput = () => {
        const typeConfig: TypeConfig = ({
            'open_file': {
                label: 'Path',
                component: <FileSelector isFile={true} />
            },
            'open_dir': {
                label: 'Path',
                component: <FileSelector isFile={false} />
            },
            'open_url': {
                label: 'URL',
                component: <Input />
            },
            'exec_command': {
                label: 'Command',
                component: <Input />
            }
        });
    
        const type = form.getFieldValue('typ') as keyof TypeConfig;
        const config = typeConfig[type];
    
        return config ? (
            <Form.Item label={config.label} name="command">
                {config.component}
            </Form.Item>
        ) : null;
    };

    return (
        <div className="action-modify" >
            <h1>Modify Action</h1>
            <Form 
                {...layout} 
                form={form} 
                initialValues={initialValues}
                onFinish={handleSubmit} 
                style={{ maxWidth: 600 }} 
                requiredMark={false} 
                autoComplete='off'
            >
                <Form.Item label="Action Name" name="name" rules={[{ required: true, message: 'Please input the action name!' }]}>
                    <Input placeholder='Action Name' autoComplete='off' />
                </Form.Item>
                <Form.Item label="Description" name="desc">
                    <Input />
                </Form.Item>
                <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.typ !== curValues.typ}>
                    {() => renderCommandInput()}
                </Form.Item>
                <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.typ !== curValues.typ}>
                    {({ getFieldValue }) =>
                        getFieldValue('typ') === 'exec_command' ? (
                            <Form.Item label="Arguments" name="args">
                                <Input />
                            </Form.Item>
                        ) : null
                    }
                </Form.Item>
                <Form.Item label="Type" name="typ">
                    <Select
                        options={actionTypeOptions}
                        onChange={handleSelectTypeChange}
                        placeholder="Select a option and change input text above"
                        allowClear
                    />
                </Form.Item>
                <Form.Item label="Wait" name="wait">
                    <InputNumber suffix="ms" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Timeout" name="timeout">
                    <InputNumber placeholder='超时时间默认为30s' suffix="ms" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Retry" name="retry">
                    <InputNumber suffix="times" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 14, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ActionModify;