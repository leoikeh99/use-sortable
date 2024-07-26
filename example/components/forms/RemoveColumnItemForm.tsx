import { useState } from 'react';
import { MyColumn } from '../../types';

type Props = {
  columns: MyColumn[];
  removeColumnItem: (itemId: string) => void;
};

const RemoveColumnItemForm = ({ columns, removeColumnItem }: Props) => {
  const [columnId, setColumnId] = useState(columns[0].id);
  const [itemId, setItemId] = useState<string>(columns[0].tasks[0].id);
  return (
    <div>
      <h2>Remove Column Item</h2>
      <br />
      <form
        action=""
        className="flex gap-3 flex-col max-w-md"
        onSubmit={(e) => {
          e.preventDefault();

          removeColumnItem(itemId);
        }}
      >
        <select
          name="columnId"
          className="border"
          value={columnId}
          onChange={(e) => setColumnId(e.target.value)}
        >
          {columns.map((column) => (
            <option value={column.id} key={column.id}>
              {column.name}
            </option>
          ))}
        </select>
        {columnId && (
          <select
            name="itemId"
            className="border"
            value={itemId!}
            onChange={(e) => setItemId(e.target.value)}
          >
            {columns
              .find((column) => column.id === columnId)
              ?.tasks.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.title}
                </option>
              ))}
          </select>
        )}
        <button
          type="submit"
          className="bg-emerald-400 p-2 rounded-sm text-white"
        >
          Remove
        </button>
      </form>{' '}
    </div>
  );
};

export default RemoveColumnItemForm;
