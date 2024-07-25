import { Draggable } from "@hello-pangea/dnd";
import { cn } from "../utils";
import { MyTask } from "../types";

const Task = ({ task, index }: { task: MyTask; index: number }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={cn(
            "block p-2 text-white w-full transition-colors duration-500",
            snapshot.isDragging ? "bg-emerald-700" : "bg-neutral-800"
          )}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {task.title}
          {", order: "}
          {task.order}
        </div>
      )}
    </Draggable>
  );
};

export default Task;
