import { MyColumn } from '@/types';
import { MakeOptional } from '../../../../src/types';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';

type Props = {
  columns: MyColumn[];
  addColumn: (item: MakeOptional<MyColumn, 'order'>) => void;
};

const AddColumnForm = ({ columns, addColumn }: Props) => {
  const maxOrder = useMemo(() => columns.length! + 1 || 1, [columns]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = (e.target as any).name.value as string;
    const order = ((e.target as any).order.value as number) || maxOrder;

    if (order > maxOrder) {
      alert('Order can not be greater than ' + maxOrder);
      return;
    }

    addColumn({
      id: Date.now().toString(),
      name,
      order, //order is optional
      tasks: [], //you can also add initial tasks while creating a column
    });
  };
  return (
    <div className="p-2 border rounded-md">
      <h2 className="form-header">Add new column</h2>
      <form action="" className="form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Enter title:</label>
          <input
            type="text"
            name="name"
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

export default AddColumnForm;
