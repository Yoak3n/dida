import React from 'react';
import { FloatButton, Layout } from 'antd';
import styled, { createGlobalStyle } from 'styled-components';
import CustomHeader from './Header';
import CustomFooter from './Footer';
import { useNavigate,useLocation } from 'react-router-dom';

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
  position: relative;
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
  const navigate = useNavigate()
  return (
    <>
      <GlobalStyle />
      <StyledLayout>
        <CustomHeader />
        <StyledContent>{children}</StyledContent>
        <CustomFooter />
        <div className="float">
          <FloatButton.Group
            trigger="hover"
            style={{ insetInlineEnd: 50, position: 'absolute', top: 80 ,height: 50}}
            placement="bottom"
          >
            <FloatButton icon={<span>📊</span>} tooltip="图表" onClick={() => navigate("/task/")}/>
            <FloatButton icon={<span>⚙️</span>} tooltip="设置" onClick={() => { console.log('FloatButton clicked!') }} />
            <FloatButton icon={<span>◀</span>} tooltip="返回" onClick={() => { navigate(-1)}} />
          </FloatButton.Group>
        </div>

      </StyledLayout>
    </>
  );
};

export default AppLayout;