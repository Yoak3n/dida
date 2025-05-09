import React from "react";
import { executeActions } from "@/utils";
import { Button, Tooltip, Checkbox } from "antd";
import type { TaskView } from "@/types";

interface TaskItemProps {
    task: TaskView
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
    return (
        <div className="today-task-item">
            <Checkbox
                checked={task.completed}
                onChange={(e) => {
                    task.completed = e.target.checked
                }}
            />
            <Tooltip title={task.desc} placement="topLeft">
                <Button
                    type="text"
                    style={{ width: "100%" }}
                    onClick={(e) => {
                        e.stopPropagation()
                        executeActions(task.actions)
                    }
                    }>
                    {task.name}
                </Button>
            </Tooltip>
        </div>
    );
}

export default TaskItem;
