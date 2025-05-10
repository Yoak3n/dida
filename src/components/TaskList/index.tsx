import React from "react";
import { List } from "antd";
import type{ TaskView } from "@/types";

import TaskItem from "./TaskItem";
import "./index.css";
interface TaskListProps {
    tasks: TaskView[];
    grid?: boolean;
    onChange?: (id: number, completed: boolean) => void;
}

const TaskList:React.FC<TaskListProps> = ({tasks,grid=true,onChange}) => {
    return (
        <List
            itemLayout="horizontal"
            grid={grid ? {gutter: 8, xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 } : undefined}
            dataSource={tasks }
            renderItem={(item) => (
                <List.Item >
                    <TaskItem task={item} onStatusChange={onChange}/>
                </List.Item>
            )}
        />
    );
}

export default TaskList;
