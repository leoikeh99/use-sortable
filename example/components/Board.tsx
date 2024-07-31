import { data } from '../data';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useSortable } from '../../src';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { createPromise } from '@/lib/utils';
import { OptimisticColumnData, OptimisticItemData } from '../../src/types';
import Column from './Column';
import Header from './Header';
import AddTaskForm from './forms/tasks/AddTaskForm';
import EditTaskForm from './forms/tasks/EditTaskForm';
import AddColumnForm from './forms/columns/AddColumnForm';
import EditColumnForm from './forms/columns/EditColumnForm';

const Board = () => {
  const { columns, dragEndHandler, fns } = useSortable(data.columns, 'tasks');

  async function updateTask(values: OptimisticItemData) {
    //values contain the current and old state of the optimistic data
    const data = await createPromise(values, 3000); //do something after promise is completed
    console.log(data);
  }

  async function updateColumn(values: OptimisticColumnData) {
    //values contain the current and old state of the optimistic data
    const data = await createPromise(values, 3000); //do something after promise is completed
    console.log(data);
  }

  const handleDrag = (result: DropResult) => {
    //With optimistic updates
    dragEndHandler(
      result,
      { reorderColumns: true },
      { updateItem: updateTask, updateColumn }
    );
  };

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
        <TabsContent value="columns">
          <div className="sm:p-2 grid sm:grid-cols-[repeat(auto-fit,_minmax(20rem,1fr))] gap-4">
            <AddColumnForm columns={columns} addColumn={fns.createColumn} />
            <EditColumnForm
              columns={columns}
              updateColumn={fns.updateColumn}
              removeColumn={fns.removeColumn}
            />
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Board;
