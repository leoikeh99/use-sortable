import { Button } from '@/components/ui/button';
import { MyColumn, MyTask } from '@/types';
import React, { useMemo, useState } from 'react';

type Props = {
  columns: MyColumn[];
  updateColumnItem: (
    itemId: string,
    update: Omit<Partial<MyTask>, 'id' | 'order'>
  ) => void;
  removeColumnItem: (itemId: string) => void;
};

const EditTaskForm = ({
  columns,
  updateColumnItem,
  removeColumnItem,
}: Props) => {
  const [title, setTitle] = useState('');
  const [columnId, setColumnId] = useState('');
  const [taskId, setTaskId] = useState('');

  const columnAvailable = useMemo(
    () => columns.some((column) => column.id === columnId),
    [columns, columnId]
  );

  const onTaskChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTaskId(e.target.value);
    setTitle(
      columns
        .find((column) => column.id === columnId)
        ?.tasks.find((task) => task.id === e.target.value)?.title || ''
    );
  };

  const removeTask = () => {
    removeColumnItem(taskId);
    setTaskId('');
    setTitle('');
  };

  return (
    <div className="p-2 border rounded-md">
      <h2 className="form-header">Edit task</h2>
      <form
        action=""
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          updateColumnItem(taskId, {
            title,
          });
        }}
      >
        <div>
          <label htmlFor="columnId">Select column:</label>
          <select
            name="columnId"
            className="input"
            value={columnId}
            onChange={(e) => setColumnId(e.target.value)}
          >
            <option value="">Select column</option>
            {columns.map((column) => (
              <option value={column.id} key={column.id}>
                {column.name}
              </option>
            ))}
          </select>
        </div>
        {columnId && (
          <div>
            <label htmlFor="taskId">Select task:</label>
            <select
              name="taskId"
              className="input"
              value={taskId}
              onChange={onTaskChange}
            >
              <option value="">Select task</option>
              {columns
                .find((column) => column.id === columnId)
                ?.tasks.map((task) => (
                  <option value={task.id} key={task.id}>
                    Task Id: {task.id}
                  </option>
                ))}
            </select>
          </div>
        )}
        <div>
          <label htmlFor="title">Enter title:</label>
          <input
            type="text"
            name="title"
            className="input"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          disabled={!columnAvailable || !taskId || title.trim() === ''}
        >
          Update
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={removeTask}
          disabled={!columnAvailable && !taskId}
        >
          Remove
        </Button>
      </form>
    </div>
  );
};

export default EditTaskForm;
