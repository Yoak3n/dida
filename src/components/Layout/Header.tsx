import React from 'react';
import { Layout, Button } from 'antd';
import { MinusOutlined, CloseOutlined, BorderOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Header } = Layout;


const StyledHeader = styled(Header)`
  background: #1890ff;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  -webkit-app-region: drag;
  height: 48px;
`;

const AppTitle = styled.div`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const WindowControls = styled.div`
  display: flex;
  -webkit-app-region: no-drag;
`;

const ControlButton = styled(Button)`
  border: none;
  background: transparent;
  color: white;
  font-size: 16px;
  padding: 0 8px;
  height: 32px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
  }
`;

const CustomHeader: React.FC = () => {
    const handleMinimize = () => {
      // @ts-ignore - Tauri API
      window.__TAURI__?.window.appWindow.minimize();
    };
  
    const handleMaximize = () => {
      // @ts-ignore - Tauri API
      window.__TAURI__?.window.appWindow.toggleMaximize();
    };
  
    const handleClose = () => {
      // @ts-ignore - Tauri API
      window.__TAURI__?.window.appWindow.close();
    };
  
    return (
      <StyledHeader>
        <AppTitle>DiDa 应用</AppTitle>
        <WindowControls>
          <ControlButton icon={<MinusOutlined />} onClick={handleMinimize} />
          <ControlButton icon={<BorderOutlined />} onClick={handleMaximize} />
          <ControlButton icon={<CloseOutlined />} onClick={handleClose} />
        </WindowControls>
      </StyledHeader>
    );
  };
  
  export default CustomHeader;