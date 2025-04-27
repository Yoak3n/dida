import React, { useState } from 'react';

import { UploadOutlined } from '@ant-design/icons';
import { Form, Input, Select, InputNumber, Button, Upload,message } from "antd";
import type { GetProp, UploadFile, UploadProps } from 'antd';
import type { Action, ActionType } from "../types";


type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const ActionModify: React.FC = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
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
            // Add more cases for other types
            default:
                break;
        }
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    }
    const uploadProps: UploadProps = {
        onChange({ file, fileList }) {
            if (file.status !== 'uploading') {
                console.log(file, fileList);
            }
        },
        onRemove: (file) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([...fileList, file]);
            console.log(fileList);
            return false;
        },
        fileList,
      };
      const handleUpload = () => {
        const formData = new FormData();
        fileList.forEach((file) => {
          formData.append('files[]', file as FileType);
        });
        // You can use any AJAX library you like
        fetch('https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload', {
          method: 'POST',
          body: formData,
        })
          .then((res) => res.json())
          .then(() => {
            setFileList([]);
            message.success('upload successfully.');
          })
          .catch(() => {
            message.error('upload failed.');
          })
          .finally(() => {
          });
      };

    return (
        <div className="action-modify">
            <h1>Modify Action</h1>
            <Form {...layout} onFinish={handleSubmit} form={form} style={{ maxWidth: 600 }}>
                <Form.Item label="Action Name" name="name">
                    <Input type="text" name="title" value={action.name} onChange={handleInputChange} placeholder='Action Name' />
                </Form.Item >
                <Form.Item label="Description" name="description" initialValue={action.desc}>
                    <Input type="text" name="description" value={action.desc} onChange={handleInputChange} />
                </Form.Item >
                <Form.Item noStyle
                    shouldUpdate={(prevValues, curValues) => prevValues.typ !== curValues.typ}
                    >
                    {/* 不懂react的更新机制 */}
                    {({ getFieldValue }) =>
                        getFieldValue('typ') === 'open_file' ? (
                            <Form.Item label="Path" name="command" initialValue={action.command}>
                                <input type="file" id="filePath" onChange={(e)=>{
                                    console.log(e.target.files![0].path)
                                }}/>
                            </Form.Item>
                        ) : getFieldValue('typ') === 'open_dir' ? (
                            <Form.Item label="Path" name="command" initialValue={action.command}>
                                <Upload directory {...uploadProps} >
                                    <Button icon={<UploadOutlined />} >Upload</Button>
                                </Upload>
                            </Form.Item>
                        ) : null
                    }
                </Form.Item >
                <Form.Item label="Arguments" name="args" initialValue={action.args}>
                    <Input type="text" name="args" value={action.args} onChange={handleInputChange} />
                </Form.Item >
                <Form.Item label="Type" name="typ" initialValue={action.typ}>
                    <Select
                        options={actionTypeOptions}
                        onChange={handleSelectTypeChange}
                        placeholder="Select a option and change input text above" allowClear />
                </Form.Item >
                <Form.Item label="Wait" name="wait" initialValue={action.wait}>
                    <InputNumber name="wait" suffix="ms" value={action.wait} style={{ width: '100%' }} />
                </Form.Item >
                <Form.Item label="Retry" name="retry" initialValue={action.retry} >
                    <InputNumber type="text" name="retry" suffix="times" value={action.retry} style={{ width: '100%' }} />
                </Form.Item >

                <Form.Item wrapperCol={{ offset: 14, span: 16 }}>
                    <Button type="primary" onClick={()=>{
                        console.log(fileList)
                    }} >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default ActionModify;