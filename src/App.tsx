import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import AppLayout from './components/Layout/AppLayout';
import Home from './pages/Home';
import Apps from './pages/Dashboard';
import Settings from './pages/Settings';
import './App.css';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Apps />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </AppLayout>
      </Router>
    </ConfigProvider>
  );
};

export default App;
