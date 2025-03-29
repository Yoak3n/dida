import React, { useState } from 'react';
import { Calendar, Badge, Card, Tooltip, Modal, List } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import styled from 'styled-components';


const StyledCalendarCard = styled(Card)`
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  .ant-picker-calendar-header {
    padding: 12px 16px;
  }
  
  .ant-picker-cell-inner {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .ant-picker-calendar-date-content {
    flex: 1;
    overflow: hidden;
    scrollbar-width: none; 
    -ms-overflow-style: none; 
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const EventBadge = styled(Badge)`
  margin-bottom: 4px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

// 模拟数据 - 实际应用中可以从API获取
const getListData = (value: Dayjs) => {
  const day = value.date();
  const month = value.month();

  // 模拟一些事件数据
  const eventData = [
    // 本月第3天有3个事件
    {
      date: dayjs().date(3).month(month), events: [
        { type: 'success', content: '项目启动会议' },
        { type: 'warning', content: '提交周报' },
        { type: 'error', content: '紧急修复Bug' },
        { type: 'processing', content: '代码评审'}
      ]
    },
    // 本月第10天有2个事件
    {
      date: dayjs().date(10).month(month), events: [
        { type: 'success', content: '团队建设活动' },
        { type: 'warning', content: '代码审查' },
      ]
    },
    // 本月第15天有1个事件
    {
      date: dayjs().date(15).month(month), events: [
        { type: 'error', content: '项目截止日期' },
      ]
    },
    // 本月第20天有2个事件
    {
      date: dayjs().date(20).month(month), events: [
        { type: 'success', content: '发布新版本' },
        { type: 'warning', content: '用户反馈会议' },
      ]
    },
    // 本月第25天有1个事件
    {
      date: dayjs().date(25).month(month), events: [
        { type: 'warning', content: '月度总结会议' },
      ]
    },
  ];

  const matchedData = eventData.find(item =>
    item.date.date() === day && item.date.month() === month
  );

  return matchedData ? matchedData.events : [];
};


const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<any[]>([]);


  // 显示事件详情
  const showEventDetails = (date: Dayjs, events: any[]) => {
    setSelectedDate(date);
    setSelectedEvents(events);
    setModalVisible(true);
  };

  // 处理日期选择
  const onSelect = (date: Dayjs) => {
    const events = getListData(date);
    if (events.length > 0) {
      showEventDetails(date, events);
    } else {
      setSelectedDate(date);
      // 这里可以添加创建新事件的逻辑
    }
  };

  return (
    <div>
      <StyledCalendarCard>
        <Calendar
          onSelect={onSelect}
          fullCellRender={(current,info)=>{
            const listData = getListData(current);
            const isToday = current.isSame(dayjs(), 'day');
            if (info.type === 'date') {
             return (
              <div
              className="ant-picker-cell-inner ant-picker-calendar-date"
              style={{
                backgroundColor: isToday ? 'rgba(24, 144, 255, 0.1)' : undefined,
                borderRadius: isToday ? '4px' : undefined,
                height: '100%',
                minHeight: '115px',
                maxHeight: '115px',
                display: 'flex',
                flexDirection: 'column',
                padding: '4px 8px'
              }}
            >
              <div 
                className="ant-picker-calendar-date-value" 
                style={{ 
                  fontWeight: isToday ? 'bold' : 'normal',
                  color: isToday ? '#1890ff' : undefined
                }}
              >
                {current.date()}
              </div>
              <div className="ant-picker-calendar-date-content">
                {listData.slice(0, 3).map((item, index) => (
                  <Tooltip key={index} title={item.content}>
                    <EventBadge
                      status={item.type as any}
                      text={item.content}
                      onClick={(e) => {
                        e.stopPropagation();
                        showEventDetails(current, listData);
                      }}
                    />
                  </Tooltip>
                ))}
                {listData.length > 3 && (
                  <EventBadge
                    status="processing"
                    text={`还有 ${listData.length - 3} 项`}
                    onClick={(e) => {
                      e.stopPropagation();
                      showEventDetails(current, listData);
                    }}
                  />
                )}
              </div>
            </div>
             ); 
            }
            return info.originNode;
          }}
          // cellRender={(current, info) => {
          //   if (info.type === 'date') return dateCellRender(current);
          //   return info.originNode;
          // }}
        />
      </StyledCalendarCard>

      <Modal
        title={selectedDate ? `${selectedDate.format('YYYY年MM月DD日')}的事件` : '事件详情'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <List
          itemLayout="horizontal"
          dataSource={selectedEvents}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Badge status={item.type as any} />}
                title={item.content}
                description={`优先级: ${item.type === 'error' ? '高' :
                  item.type === 'warning' ? '中' : '低'
                  }`}
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;