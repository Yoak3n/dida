import { Outlet, useNavigate, useLocation} from "react-router-dom";
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

const items: TabsProps['items'] = [
    {
      key: '/view/',
      label: '今日',
    },
    {
      key: '/view/weekly',
      label: '周',
    },
    {
      key: '/view/monthly',
      label: '月',
    },
  ];

const View = () => {
    const navigate = useNavigate();
    const onChange = (key: string) => {
        navigate(key);
    };
    const location = useLocation();
    return (
        <>
            <Tabs defaultActiveKey="/view/" items={items} onChange={onChange} activeKey={location.pathname} />
            <Outlet />
        </>
    );
}

export default View;