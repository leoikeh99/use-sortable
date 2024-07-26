import { MakeOptional } from '../../../src/types';
import { MyColumn, MyTask } from '../../types';

type Props = {
  columns: MyColumn[];
  addColumnItem: (
    columnId: string,
    item: MakeOptional<MyTask, 'order'>
  ) => void;
};

const AddColumnItemForm = ({ columns, addColumnItem }: Props) => {
  return (
    <div>
      <h2>Add Column Item</h2>
      <br />
      <form
        action=""
        className="flex gap-3 flex-col max-w-md"
        onSubmit={(e) => {
          e.preventDefault();

          const taskName = (e.target as any).title.value as string;
          const columnId = (e.target as any).columnId.value as string;

          addColumnItem(columnId, {
            id: Date.now().toString(),
            title: taskName,
            order: 2,
          });
        }}
      >
        <input
          type="text"
          name="title"
          className="border"
          placeholder="Enter title"
        />
        <select name="columnId" className="border">
          {columns.map((column) => (
            <option value={column.id} key={column.id}>
              {column.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-emerald-400 p-2 rounded-sm text-white"
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default AddColumnItemForm;
