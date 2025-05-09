import React from "react";
import { List } from "antd";
import type{ TaskView } from "@/types";

import TaskItem from "./TaskItem";
import "./index.css";
interface TaskListProps {
    tasks: TaskView[];
}

const TaskList:React.FC<TaskListProps> = ({tasks}) => {
    return (
        <List
            itemLayout="horizontal"
            dataSource={tasks }
            renderItem={(item) => (
                <List.Item>
                    <TaskItem task={item}/>
                </List.Item>
            )}
        />
    );
}

export default TaskList;
