import { MyColumn, MyTask } from '@/types';
import { MakeOptional } from '../../../../src/types';
import { Button } from '@/components/ui/button';
import { useCallback } from 'react';

type Props = {
  columns: MyColumn[];
  addColumnItem: (
    columnId: string,
    item: MakeOptional<MyTask, 'order'>
  ) => void;
};

const AddTaskForm = ({ columns, addColumnItem }: Props) => {
  const maxOrder = useCallback(
    (columnId: string) =>
      columns.find((column) => column.id === columnId)?.tasks.length! + 1 || 1,
    [columns]
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const title = (e.target as any).title.value as string;
    const columnId = (e.target as any).columnId.value as string;

    const _maxOrder = maxOrder(columnId);

    const order = ((e.target as any).order.value as number) || _maxOrder;

    if (order > maxOrder(columnId)) {
      alert('Order can not be greater than ' + maxOrder(columnId));
      return;
    }

    if (order <= 0) {
      alert('Order must be greater than 0');
      return;
    }

    addColumnItem(columnId, {
      id: Date.now().toString(),
      title,
      order, //order is optional
    });
  };
  return (
    <div className="p-2 border rounded-md">
      <h2 className="form-header">Add new task</h2>
      <form action="" className="form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="columnId">Select column:</label>
          <select name="columnId" className="input">
            {columns.map((column) => (
              <option value={column.id} key={column.id}>
                {column.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="title">Enter title:</label>
          <input
            type="text"
            name="title"
            className="input"
            placeholder="Some title..."
            required
          />
        </div>
        <div>
          <label htmlFor="order">Enter order (optional):</label>
          <input
            type="number"
            name="order"
            className="input"
            placeholder="Enter order"
            min={1}
          />
        </div>
        <Button type="submit" className="bg-emerald-500">
          Add
        </Button>
      </form>
    </div>
  );
};

export default AddTaskForm;
