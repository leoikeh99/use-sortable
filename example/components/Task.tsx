import { Draggable } from '@hello-pangea/dnd';
import { cn } from '../lib/utils';
import { MyTask } from '../types';
import { Grip } from 'lucide-react';

const Task = ({ task, index }: { task: MyTask; index: number }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={cn(
            'block p-2 text-white w-full transition-colors duration-500',
            snapshot.isDragging ? 'bg-emerald-700' : 'bg-neutral-800'
          )}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div className="flex items-center  gap-1 ">
            <span {...provided.dragHandleProps}>
              <Grip size={16} />
            </span>
            <p>
              {task.title}
              {', order: '}
              {task.order}
            </p>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
