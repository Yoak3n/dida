import React, { useState } from 'react';

import { UploadOutlined } from '@ant-design/icons';
import { Form, Input, Select, InputNumber, Button, Tag, Typography, Tooltip } from "antd";
import { invoke } from '@tauri-apps/api/core';

import type { Action, ActionType } from "../types";
import SubmitActionButton from '../components/Invoke/SubmitAction';
const { Paragraph } = Typography;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const ActionModify: React.FC = () => {
    const [form] = Form.useForm();
    const [action, setAction] = useState<Action>({
        name: "",
        desc: "",
        command: "",
        args: [],
        typ: "open_file",
        wait: 0,
        retry: 0,
    });
    const actionTypeOptions = [
        { value: "open_file", label: "Open File" },
        { value: "exec_command", label: "Execute Command" },
        { value: "open_dir", label: "Open Directory" },
        { value: "open_url", label: "Open URL" },
    ]
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setAction((prevAction) => ({
            ...prevAction,
            [name]: value,
        }));
    };

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
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    }

    const handleSelectFile = async (file: boolean) => {
        const path: string = await invoke('select_file', { file })
        setAction((prevAction) => ({
            ...prevAction,
            command: path,
        }));

    }
    const FileTag: React.FC = () => {
        return (
            <div>
                <Tooltip title={action.command} arrow={false}>
                    <Tag style={{ maxWidth: 400 }} color="blue" closable onClose={(e) => {
                        e.preventDefault();
                        setAction((prevAction) => ({
                            ...prevAction,
                            command: "",
                        }));
                    }}>
                        <Paragraph ellipsis={true} style={{ margin: 0 }}>
                            {action.command}
                        </Paragraph>
                    </Tag>
                </Tooltip>
            </div>

        )
    }
    interface TypeConfig {
        [key: string]: {
            label: string;
            component: JSX.Element;
        };
    }
    const renderCommandInput = () => {
        const typeConfig:TypeConfig =  ({
            'open_file': {
                label: 'Path',
                component: (
                    <>
                        <Button icon={<UploadOutlined />} onClick={() => handleSelectFile(true)}>
                            Select File
                        </Button>
                        {action.command && action.command !== "" && <FileTag />}
                    </>
                )
            },
            'open_dir': {
                label: 'Path',
                component: (
                    <>
                        <Button icon={<UploadOutlined />} onClick={() => handleSelectFile(false)}>
                            Select Directory
                        </Button>
                        {action.command && action.command !== "" && <FileTag />}
                    </>
                )
            },
            'open_url': {
                label: 'URL',
                component: (
                    <Input
                        type="text"
                        name="command"
                        value={action.command}
                        onChange={handleInputChange}
                    />
                )
            },
            'exec_command': {
                label: 'Command',
                component: (
                    <Input
                        type="text"
                        name="command"
                        value={action.command}
                        onChange={handleInputChange}
                    />
                )
            }
        });

        const type = form.getFieldValue('typ') as keyof TypeConfig;
        const config = typeConfig[type];

        return config ? (
            <Form.Item label={config.label}  initialValue={action.command}>
                {config.component}
            </Form.Item>
        ) : null;
    };

    return (
        <div className="action-modify" >
            <h1>Modify Action</h1>
            <Form {...layout} onFinish={handleSubmit} form={form} style={{ maxWidth: 600 }} requiredMark={false}>
                <Form.Item label="Action Name" name="name" rules={[{ required: true, message: 'Please input the action name!' }]}>
                    <Input type="text" name="name" value={action.name} onChange={handleInputChange} placeholder='Action Name' autoComplete='off' />
                </Form.Item >
                <Form.Item label="Description" name="desc" initialValue={action.desc}>
                    <Input type="text" name="desc" value={action.desc} onChange={handleInputChange} />
                </Form.Item >
                <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.typ !== curValues.typ}>
                    {() => renderCommandInput()}
                </Form.Item>
                <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.typ !== curValues.typ}>
                    {({ getFieldValue }) =>
                        getFieldValue('typ') === 'exec_command' ? (
                            <Form.Item label="Arguments" name="args" initialValue={action.args}>
                                <Input type="text" name="args" value={action.args} onChange={handleInputChange} />
                            </Form.Item>
                        ) : null
                    }
                </Form.Item>
                <Form.Item label="Type" name="typ" initialValue={action.typ}>
                    <Select
                        options={actionTypeOptions}
                        onChange={handleSelectTypeChange}
                        placeholder="Select a option and change input text above"
                        allowClear
                    />
                </Form.Item>
                <Form.Item label="Wait" name="wait" initialValue={action.wait}>
                    <InputNumber 
                    onChange={(v)=>{
                        setAction((prevAction) => ({
                          ...prevAction,
                            wait: v as number,
                        }));
                    }}
                    name="wait" 
                    suffix="ms" 
                    value={action.wait} 
                    style={{ width: '100%' }} />
                </Form.Item >
                <Form.Item label="Retry" name="retry" initialValue={action.retry} >
                    <InputNumber 
                    onChange={(v)=>{
                        setAction((prevAction) => ({
                           ...prevAction,
                            retry: v as number,
                        }));
                    }}
                    type="text" 
                    name="retry" 
                    suffix="times" 
                    value={action.retry} 
                    style={{ width: '100%' }} />
                </Form.Item >

                <Form.Item wrapperCol={{ offset: 14, span: 16 }}>
                    <SubmitActionButton data={action} />
                </Form.Item>
            </Form>
        </div>
    );
}

export default ActionModify;