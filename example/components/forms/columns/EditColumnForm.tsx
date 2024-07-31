import { Button } from '@/components/ui/button';
import { MyColumn } from '@/types';
import React, { useMemo, useState } from 'react';

type Props = {
  columns: MyColumn[];
  updateColumn: (
    itemId: string,
    update: Omit<Partial<MyColumn>, 'id' | 'order'>
  ) => void;
  removeColumn: (columnId: string) => void;
};

const EditColumnForm = ({ columns, updateColumn, removeColumn }: Props) => {
  const [name, setName] = useState('');
  const [columnId, setColumnId] = useState('');

  const columnAvailable = useMemo(
    () => columns.some((column) => column.id === columnId),
    [columns, columnId]
  );

  const onColumnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setColumnId(e.target.value);
    setName(columns.find((column) => column.id === e.target.value)?.name || '');
  };

  const removeColumnHandler = () => {
    removeColumn(columnId);
    setColumnId('');
    setName('');
  };

  return (
    <div className="p-2 border rounded-md">
      <h2 className="form-header">Edit column</h2>
      <form
        action=""
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          updateColumn(columnId, {
            name,
          });
        }}
      >
        <div>
          <label htmlFor="columnId">Select column:</label>
          <select
            name="columnId"
            className="input"
            value={columnId}
            onChange={onColumnChange}
          >
            <option value="">Select column</option>
            {columns.map((column) => (
              <option value={column.id} key={column.id}>
                {column.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="name">Enter title:</label>
          <input
            type="text"
            name="name"
            className="input"
            placeholder="Enter title"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={!columnAvailable || name.trim() === ''}>
          Update
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={removeColumnHandler}
          disabled={!columnAvailable}
        >
          Remove
        </Button>
      </form>
    </div>
  );
};

export default EditColumnForm;
