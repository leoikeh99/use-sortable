import { data } from '../data';
import Column from './Column';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useSortable } from '../../src';
import { useEffect, useState } from 'react';
import AddColumnItemForm from './forms/AddColumnItemForm';
import RemoveColumnItemForm from './forms/RemoveColumnItemForm';

const Board = () => {
  const { columns, dragEndHandler, fns } = useSortable(data.columns, 'tasks');
  const [error] = useState(false);

  const handleDrag = (result: DropResult) => {
    //With optimistic updates
    dragEndHandler(
      result,
      { reorderColumns: true },
      {
        updateItem: async (values) => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              if (!error) {
                return resolve(console.log(values));
              } else {
                return reject('Some Error');
              }
            }, 3000);
          });
        },
        updateColumn: async (values) => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              if (!error) {
                return resolve(console.log(values));
              } else {
                return reject('Some Error');
              }
            }, 3000);
          });
        },
      }
    );
  };

  useEffect(() => {}, []);

  return (
    <div className="mt-20">
      <DragDropContext onDragEnd={handleDrag}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <div
              className="grid grid-cols-4 gap-1 border border-black p-2"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {columns.map((column, index) => (
                <Column key={column.id} column={column} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button
        className="p-2 bg-blue-500 text-white rounded-md"
        onClick={() =>
          fns.createColumn({
            id: Date.now().toString(),
            name: 'New Column',
            order: 5,
            tasks: [
              { id: (Date.now() + 1).toString(), title: 'New Task', order: 1 },
            ],
          })
        }
      >
        Create Column
      </button>
      <button
        className="p-2 bg-red-500 text-white rounded-md"
        onClick={() => fns.removeColumn('column3')}
      >
        Remove Column
      </button>
      <div className="p-2 grid grid-cols-2 gap-2">
        <AddColumnItemForm
          columns={data.columns}
          addColumnItem={fns.createColumnItem}
        />
        <RemoveColumnItemForm
          columns={data.columns}
          removeColumnItem={fns.removeColumnItem}
        />
      </div>
    </div>
  );
};

export default Board;
