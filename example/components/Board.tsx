import { data } from '../data';
import Column from './Column';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useSortable } from '../../src';
import { useEffect, useState } from 'react';
import AddTaskForm from './forms/tasks/AddTaskForm';
import Header from './Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import EditTaskForm from './forms/tasks/EditTaskForm';

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
    <main>
      <Header />
      <DragDropContext onDragEnd={handleDrag}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <div
              className={`flex gap-2 px-4 my-6 w-full overflow-x-auto`}
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

      <Tabs defaultValue="tasks" className="container mx-auto mb-5">
        <TabsList className="grid max-w-[30rem] grid-cols-2 mx-auto ">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="columns">Columns</TabsTrigger>
        </TabsList>
        <TabsContent value="columns"></TabsContent>
        <TabsContent value="tasks">
          <div className="sm:p-2 grid sm:grid-cols-[repeat(auto-fit,_minmax(20rem,1fr))] gap-4">
            <AddTaskForm
              columns={columns}
              addColumnItem={fns.createColumnItem}
            />
            <EditTaskForm
              columns={columns}
              updateColumnItem={fns.updateColumnItem}
              removeColumnItem={fns.removeColumnItem}
            />
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Board;
