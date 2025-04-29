import { TaskItem } from '@tiptap/extension-task-item'
import { invoke } from '@tauri-apps/api/core'
import { RawCommands, CommandProps, Editor } from '@tiptap/core'
import { TaskList } from '@tiptap/extension-task-list'

// 异步获取任务ID
async function uuid(): Promise<string> {
    return await invoke('gen_random_task_id')
}

// 自定义任务项扩展
export const CustomTaskItem = TaskItem.extend({
    name: 'customTaskItem',
  
    addAttributes() {
      return {
        ...this.parent?.(),
        id: {
          default: null,
          parseHTML: el => el.getAttribute('data-id'),
          renderHTML: attrs => ({ 'data-id': attrs.id }),
        },
        nestingLevel: {
          default: 0,
          parseHTML: el => parseInt(el.getAttribute('data-nesting-level') || '0', 10),
          renderHTML: attrs => ({ 'data-nesting-level': attrs.nestingLevel }),
        },
      }
    },
  
    renderHTML({ node, HTMLAttributes }) {
        // 使用默认ID
        const defaultId = `temp-${Math.random().toString(36).substring(2, 9)}`;
        
        return [
          'li',
          {
            'data-type': 'customTaskItem',
            'data-checked': node.attrs.checked,
            'data-id': node.attrs.id || HTMLAttributes.id || defaultId,
            'data-nesting-level': node.attrs.nestingLevel,
            style: `margin-left: ${node.attrs.nestingLevel * 20}px`,
          },
          0,
        ]
    },
    
    // 添加命令
    addCommands() {
      return {
        // 增加嵌套层级的命令 (Tab)
        'increaseNestingLevel': (() =>
          ({ tr, dispatch }: CommandProps) => {
            const { $from } = tr.selection
            const node = $from.node($from.depth)
            if (node.type.name !== this.name) return false
            const newLevel = node.attrs.nestingLevel + 1
            if (dispatch) {
              tr.setNodeAttribute($from.pos, 'nestingLevel', newLevel)
            }
            return true
          }) as any,
        // 减少嵌套层级的命令 (Shift+Tab)
        'decreaseNestingLevel': (() =>
          ({ tr, dispatch }: CommandProps) => {
            const { $from } = tr.selection
            const node = $from.node($from.depth)
            if (node.type.name !== this.name) return false
            const newLevel = Math.max(0, node.attrs.nestingLevel - 1)
            if (dispatch) {
              tr.setNodeAttribute($from.pos, 'nestingLevel', newLevel)
            }
            return true
          }) as any,
      } as Partial<RawCommands>
    },
    
    // 处理临时ID替换
    onTransaction({ editor }) {
      // 检查是否有新添加的任务项
      let hasNewTaskItems = false;
      
      editor.state.doc.descendants((node) => {
        if (node.type.name === this.name && node.attrs.id && node.attrs.id.startsWith('temp-')) {
          hasNewTaskItems = true;
          // 找到一个就可以停止遍历
          return false;
        }
        // 继续遍历
        return true;
      });
      
      if (hasNewTaskItems) {
        // 直接执行替换ID的逻辑
        const replaceIds = async () => {
          editor.state.doc.descendants((node, pos) => {
            if (node.type.name === this.name) {
              const id = node.attrs.id;
              
              if (id && id.startsWith('temp-')) {
                // 获取新ID
                uuid().then(newId => {
                  // 创建新的事务来更新节点属性
                  const tr = editor.state.tr.setNodeAttribute(pos, 'id', newId);
                  editor.view.dispatch(tr);
                });
              }
            }
          });
        };
        
        replaceIds();
      }
    },
})

// 自定义任务列表扩展
export const CustomTaskList = TaskList.extend({
    name: 'customTaskList',
    content: 'customTaskItem+',
    group: 'block list',
    parseHTML() {
        return [{ tag: 'ul[data-type="customTaskList"]' }]
    },
    renderHTML() {
        return ['ul', { 'data-type': 'customTaskList' }, 0]
    },
})