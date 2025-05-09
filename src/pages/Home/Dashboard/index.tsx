import { Outlet, useNavigate, useLocation} from "react-router-dom";
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

const items: TabsProps['items'] = [
    {
      key: '/dashboard/',
      label: '今日',
    },
    {
      key: '/dashboard/weekly',
      label: '周',
    },
    {
      key: '/dashboard/monthly',
      label: '月',
    },
  ];

const Dashboard = () => {
    const navigate = useNavigate();
    const onChange = (key: string) => {
        navigate(key);
    };
    const location = useLocation();
    return (
        <>
            <Tabs defaultActiveKey="/dashboard/" items={items} onChange={onChange} activeKey={location.pathname} />
            <Outlet />
        </>
    );
}

export default Dashboard;