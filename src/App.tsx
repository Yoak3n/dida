import React,{useContext} from 'react';
import { RouterProvider } from 'react-router-dom';

import { ConfigProvider, message } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

import router from './routers';
import './App.css';
import Msg  from '@/components/Context/Msg'
const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  return (
    <ConfigProvider locale={zhCN} virtual={false}>
      <Msg.Provider value={{messageApi,contextHolder}}>
        {contextHolder}
        <RouterProvider router={router} />
      </Msg.Provider>
    </ConfigProvider>
  );
};

export default App;
