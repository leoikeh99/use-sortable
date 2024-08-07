import { Draggable, Droppable } from '@hello-pangea/dnd';
import Task from './Task';
import { MyColumn } from '../types';
import { cn } from '../lib/utils';
import { Grip } from 'lucide-react';

const Column = ({ column, index }: { column: MyColumn; index: number }) => {
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          className="rounded-md border flex flex-col bg-white min-w-[15rem]"
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div className="flex items-center  gap-1 p-2">
            <span {...provided.dragHandleProps}>
              <Grip size={16} />
            </span>
            <p>
              {column.name}: order {column.order}
            </p>
          </div>
          <Droppable droppableId={column.id} type="task">
            {(provided, snapshot) => (
              <div
                className={cn(
                  'space-y-3 p-2 min-h-24 grow',
                  snapshot.isDraggingOver ? 'bg-emerald-300' : 'bg-white'
                )}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {column.tasks.map((task, index) => (
                  <Task key={task.id} task={task} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
