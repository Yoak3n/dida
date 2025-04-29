import React, { useState } from 'react';
import RichTextEditor from '../components/RichTextEditor';

const TodoList: React.FC = () => {
  const [content, setContent] = useState('<ul data-type="customTaskList"><li data-type="customTaskItem" data-checked="false">任务1</li></ul>');

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    // 这里可以添加保存逻辑
  };

  return (
    <div className="todo-list-page">
      <h1>待办清单</h1>
      <RichTextEditor content={content} onChange={handleContentChange} />
    </div>
  );
};

export default TodoList;