import React from "react";

import {Layout} from "antd";
import { HomeOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
const { Footer } = Layout;
import styled from "styled-components";
import { useNavigate, useLocation } from 'react-router-dom';

const StyledFooter = styled(Footer)`
  padding: 0;
  height: 56px;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.03);
`;

const NavItem = styled.div<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  cursor: pointer;
  color: ${props => props.$active ? '#1890ff' : 'rgba(0, 0, 0, 0.65)'};
  font-size: 12px;
  width: 33.33%;
  transition: all 0.3s;

  &:hover {
    color: #1890ff;
  }
`;
const IconWrapper = styled.div`
  font-size: 20px;
  margin-bottom: 4px;
`;

const CustomFooter: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const navItems = [
        { key: '/', icon: <HomeOutlined />, label: '首页' },
        { key: '/task-modify', icon: <AppstoreOutlined />, label: '视图' },
        { key: '/settings', icon: <SettingOutlined />, label: '设置' },
      ];
    return (
        <StyledFooter>
        {navItems.map(item => (
          <NavItem 
            key={item.key} 
            $active={currentPath === item.key}
            onClick={() => navigate(item.key)}
          >
            <IconWrapper>{item.icon}</IconWrapper>
            {item.label}
          </NavItem>
        ))}
      </StyledFooter>
    )
}
export default CustomFooter;