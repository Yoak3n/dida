import React from 'react';
import { Layout } from 'antd';
import styled, { createGlobalStyle } from 'styled-components';
import CustomHeader from './Header';
import CustomFooter from './Footer';

const { Content } = Layout;

const GlobalStyle = createGlobalStyle`
  forced-color-adjust: none;
  @media (forced-colors: active) {
    .ant-layout,
    .ant-layout-header,
    .ant-layout-content,
    .ant-layout-footer {
      forced-color-adjust: none;
    }
  }
`;

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
    <>
      <GlobalStyle />
      <StyledLayout>
        <CustomHeader />
        <StyledContent>{children}</StyledContent>
        <CustomFooter />
      </StyledLayout>
    </>
  );
};

export default AppLayout;