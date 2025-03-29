import React from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';
import CustomHeader from './Header';
import CustomFooter from './Footer';

const { Content } = Layout;

const StyledLayout = styled(Layout)`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const StyledContent = styled(Content)`
  flex: 1;
  padding: 24px;
  overflow: auto;
`;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <StyledLayout>
      <CustomHeader />
      <StyledContent>{children}</StyledContent>
      <CustomFooter />
    </StyledLayout>
  );
};

export default AppLayout;