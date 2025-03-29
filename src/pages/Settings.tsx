import React from 'react';
import { Typography, Form, Switch, Select, Button, Divider, Input } from 'antd';
import { createGlobalStyle } from 'styled-components';
const { Title, Paragraph } = Typography;
const { Option } = Select;
const GlobalStyle = createGlobalStyle`
  @media (forced-colors: active) {
    .ant-switch,
    .ant-select-selector,
    .ant-btn,
    .ant-input {
      forced-color-adjust: none;
    }
  }
`;
const Settings: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('设置已保存:', values);
    // 添加保存设置的逻辑
  };

  return (
    <div>
      <GlobalStyle />
      <Title level={2}>设置</Title>
      <Paragraph>自定义您的应用程序设置</Paragraph>
      
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          theme: 'light',
          notifications: true,
          language: 'zh',
          autoStart: false,
        }}
        onFinish={onFinish}
      >
        <Form.Item label="主题" name="theme">
          <Select>
            <Option value="light">浅色</Option>
            <Option value="dark">深色</Option>
            <Option value="system">跟随系统</Option>
          </Select>
        </Form.Item>
        
        <Form.Item label="通知" name="notifications" valuePropName="checked">
          <Switch />
        </Form.Item>
        
        <Form.Item label="语言" name="language">
          <Select>
            <Option value="zh">中文</Option>
            <Option value="en">English</Option>
          </Select>
        </Form.Item>
        
        <Form.Item label="开机自启" name="autoStart" valuePropName="checked">
          <Switch />
        </Form.Item>
        
        <Divider />
        
        <Form.Item label="缓存目录">
          <Input readOnly value="C:\Users\AppData\Local\dida\cache" />
          <Button style={{ marginTop: 8 }}>清除缓存</Button>
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit">
            保存设置
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Settings;