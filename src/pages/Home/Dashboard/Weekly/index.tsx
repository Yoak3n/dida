import React, { useState } from 'react';
import { Card, List, Badge, Row, Col, Modal, Button, Tooltip } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import styled from 'styled-components';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';

// 扩展 dayjs 以支持周相关功能
dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);

const StyledWeekCard = styled(Card)`
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
`;

const DayCard = styled(Card)`
  height: 100%;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .ant-card-head {
    padding: 0 12px;
    min-height: 40px;
  }
  
  .ant-card-head-title {
    padding: 8px 0;
  }
  
  .ant-card-body {
    padding: 12px;
    overflow-y: auto;
    max-height: 200px;
    scrollbar-width: none;
    -ms-overflow-style: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const EventItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// 模拟数据 - 实际应用中可以从API获取
const getEventsForDay = (date: Dayjs) => {
  const day = date.day();
  const weekday = date.format('YYYY-MM-DD');
  
  // 模拟一些事件数据
  const eventData: Record<string, any[]> = {
    // 周一
    '2023-11-06': [
      { type: 'success', content: '周会' },
      { type: 'warning', content: '代码审查' },
    ],
    // 周二
    '2023-11-07': [
      { type: 'error', content: '修复紧急Bug' },
    ],
    // 周三
    '2023-11-08': [
      { type: 'success', content: '团队建设' },
      { type: 'warning', content: '项目进度汇报' },
      { type: 'processing', content: '技术分享' },
    ],
    // 周四
    '2023-11-09': [
      { type: 'warning', content: '需求评审' },
    ],
    // 周五
    '2023-11-10': [
      { type: 'success', content: '版本发布' },
      { type: 'error', content: '线上监控' },
    ],
    // 周六
    '2023-11-11': [],
    // 周日
    '2023-11-12': [],
  };
  
  // 为了演示效果，使用当前日期的星期几来获取对应的模拟数据
  const mockDate = Object.keys(eventData)[day === 0 ? 6 : day - 1];
  return eventData[mockDate] || [];
};

// 获取当前周的日期范围
const getWeekDays = (date: Dayjs) => {
  const weekStart = date.startOf('week');
  return Array.from({ length: 7 }).map((_, i) => weekStart.add(i, 'day'));
};

const Weekly: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState<Dayjs>(dayjs());
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<any[]>([]);
  
  // 获取当前周的日期
  const weekDays = getWeekDays(currentWeek);
  
  // 显示事件详情
  const showEventDetails = (date: Dayjs, events: any[]) => {
    setSelectedDate(date);
    setSelectedEvents(events);
    setModalVisible(true);
  };
  
  // 切换到上一周
  const goToPrevWeek = () => {
    setCurrentWeek(currentWeek.subtract(1, 'week'));
  };
  
  // 切换到下一周
  const goToNextWeek = () => {
    setCurrentWeek(currentWeek.add(1, 'week'));
  };
  
  // 返回当前周
  const goToCurrentWeek = () => {
    setCurrentWeek(dayjs());
  };
  
  return (
    <div>
      <StyledWeekCard
        title={`第 ${currentWeek.week()} 周 (${weekDays[0].format('YYYY-MM-DD')} 至 ${weekDays[6].format('YYYY-MM-DD')})`}
        extra={
          <div>
            <Button onClick={goToPrevWeek} style={{ marginRight: 8 }}>上一周</Button>
            <Button onClick={goToCurrentWeek} style={{ marginRight: 8 }}>本周</Button>
            <Button onClick={goToNextWeek}>下一周</Button>
          </div>
        }
      >
        <Row gutter={[16, 16]}>
          {weekDays.map((day) => {
            const events = getEventsForDay(day);
            const isToday = day.isSame(dayjs(), 'day');
            
            return (
              <Col span={24 / 7} key={day.format('YYYY-MM-DD')}>
                <DayCard
                  title={
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontWeight: isToday ? 'bold' : 'normal',
                        color: isToday ? '#1890ff' : undefined 
                      }}>
                        {day.format('ddd')}
                      </div>
                      <div style={{ 
                        fontSize: '18px', 
                        fontWeight: isToday ? 'bold' : 'normal',
                        color: isToday ? '#1890ff' : undefined 
                      }}>
                        {day.date()}
                      </div>
                    </div>
                  }
                  onClick={() => {
                    if (events.length > 0) {
                      showEventDetails(day, events);
                    }
                  }}
                  style={{
                    backgroundColor: isToday ? 'rgba(24, 144, 255, 0.05)' : undefined,
                    borderColor: isToday ? '#1890ff' : undefined,
                  }}
                >
                  {events.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#999', padding: '10px 0' }}>
                      无安排
                    </div>
                  ) : (
                    events.map((event, index) => (
                      <Tooltip key={index} title={event.content}>
                        <EventItem>
                          <Badge status={event.type as any} style={{ marginRight: 8 }} />
                          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {event.content}
                          </span>
                        </EventItem>
                      </Tooltip>
                    ))
                  )}
                </DayCard>
              </Col>
            );
          })}
        </Row>
      </StyledWeekCard>
      
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
                description={`优先级: ${
                  item.type === 'error' ? '高' :
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

export default Weekly;