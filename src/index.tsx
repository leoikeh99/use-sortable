import { useRef, useState } from 'react';
import type { Column, DropInfo, MakeOptional, Options, Updates } from './types';
import {
  isFinalOperation,
  moveColumns,
  moveItems,
  moveItemToColumn,
} from './utils';
import { nanoid } from 'nanoid';

export const useSortable = <K extends string, T extends Column<K>>(
  initialColumns: T[],
  key: K
) => {
  const columnsRef = useRef(initialColumns);
  const [optimisticColumns, setOptimisticColumns] = useState(initialColumns);

  let asyncOperationsRef = useRef<string[]>([]); //keeps track of async operations

  async function dragEndHandler<O extends Options>(
    result: DropInfo,
    options: O,
    updates?: Updates<O['reorderColumns']>
  ) {
    const { destination, source, draggableId } = result;
    const columnsDroppableId = options?.columnsDroppableId || 'all-columns';

    //if no destination, return
    if (!destination) {
      return;
    }

    //if destination is the same as source, return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    //if ordering columns
    if (
      options.reorderColumns === true &&
      destination.droppableId === columnsDroppableId
    ) {
      let newOptimisticColumns = moveColumns(optimisticColumns, result);
      setOptimisticColumns(newOptimisticColumns);

      if (updates) {
        const _updates = updates as Updates<true>;

        const operationId = nanoid();
        asyncOperationsRef.current = [
          ...asyncOperationsRef.current,
          operationId,
        ];
        try {
          await _updates.updateColumn({
            columnId: draggableId,
            newState: {
              order: destination.index + 1,
              index: destination.index,
            },
            oldState: {
              order: source.index + 1,
              index: source.index,
            },
          });

          const newColumns = moveColumns(columnsRef.current, result);
          columnsRef.current = newColumns;

          //update optimistic columns if no other operation is ahead
          if (isFinalOperation(asyncOperationsRef.current, operationId))
            setOptimisticColumns(newColumns);
          asyncOperationsRef.current = asyncOperationsRef.current.filter(
            (id) => id !== operationId
          );
        } catch (error) {
          if (isFinalOperation(asyncOperationsRef.current, operationId))
            setOptimisticColumns(columnsRef.current);
          asyncOperationsRef.current = asyncOperationsRef.current.filter(
            (id) => id !== operationId
          );
          throw error;
        }
      }
      return;
    }

    //if source and destination are in the same column
    if (source.droppableId === destination.droppableId) {
      const newOptimisticColumns = moveItems(optimisticColumns, key, result);
      setOptimisticColumns(newOptimisticColumns);

      if (updates) {
        const operationId = nanoid();
        asyncOperationsRef.current = [
          ...asyncOperationsRef.current,
          operationId,
        ];
        try {
          await updates.updateItem({
            itemId: draggableId,
            newState: {
              order: destination.index + 1,
              index: destination.index,
              columnId: source.droppableId,
            },
            oldState: {
              order: source.index + 1,
              index: source.index,
              columnId: source.droppableId,
            },
          });

          const newColumns = moveItems(columnsRef.current, key, result);
          columnsRef.current = newColumns;

          if (isFinalOperation(asyncOperationsRef.current, operationId))
            setOptimisticColumns(newColumns);
          asyncOperationsRef.current = asyncOperationsRef.current.filter(
            (id) => id !== operationId
          );
        } catch (error) {
          if (isFinalOperation(asyncOperationsRef.current, operationId))
            setOptimisticColumns(columnsRef.current);
          asyncOperationsRef.current = asyncOperationsRef.current.filter(
            (id) => id !== operationId
          );
          throw error;
        }
      }
      return;
    }

    //if source and destination are in different columns
    const newOptimisticColumns = moveItemToColumn(
      optimisticColumns,
      key,
      result
    );
    setOptimisticColumns(newOptimisticColumns);

    if (updates) {
      const operationId = nanoid();
      asyncOperationsRef.current = [...asyncOperationsRef.current, operationId];

      try {
        await updates.updateItem({
          itemId: draggableId,
          newState: {
            order: destination.index + 1,
            index: destination.index,
            columnId: destination.droppableId,
          },
          oldState: {
            order: source.index + 1,
            index: source.index,
            columnId: source.droppableId,
          },
        });

        const newColumns = moveItemToColumn(columnsRef.current, key, result);
        columnsRef.current = newColumns;

        if (isFinalOperation(asyncOperationsRef.current, operationId))
          setOptimisticColumns(newColumns);

        asyncOperationsRef.current = asyncOperationsRef.current.filter(
          (id) => id !== operationId
        );
      } catch (error) {
        if (isFinalOperation(asyncOperationsRef.current, operationId))
          setOptimisticColumns(columnsRef.current);

        asyncOperationsRef.current = asyncOperationsRef.current.filter(
          (id) => id !== operationId
        );

        throw error;
      }
    }
  }

  function createColumnItem(
    columnId: string,
    item: MakeOptional<T[K][0], 'order'>
  ) {
    const column = columnsRef.current.find((c) => c.id === columnId);
    if (!column) throw new Error('Column not found');

    let itemOrder = item.order || column[key].length + 1;
    if (itemOrder < 1 || itemOrder > column[key].length + 1)
      itemOrder = column[key].length + 1;

    const newColumnTasks = column[key].map((i) =>
      i.order >= itemOrder ? { ...i, order: i.order + 1 } : i
    );

    newColumnTasks.splice(itemOrder - 1, 0, { ...item, order: itemOrder });

    const newColumns = columnsRef.current.map((c) =>
      c.id === columnId ? { ...c, [key]: newColumnTasks } : c
    );

    setOptimisticColumns(newColumns);
    columnsRef.current = newColumns;
  }

  function removeColumnItem(itemId: string) {
    const column = columnsRef.current.find((c) =>
      c[key].some((i) => i.id === itemId)
    );
    if (!column) throw new Error('Item not found');

    const item = column[key].find((i) => i.id === itemId);
    if (!item) throw new Error('Item not found');

    let newColumnItems = [...column[key]];
    newColumnItems = newColumnItems
      .map((i) => (i.order > item.order ? { ...i, order: i.order - 1 } : i))
      .filter((item) => item.id !== itemId);

    const columns = columnsRef.current.map((c) =>
      c.id === column.id ? { ...c, [key]: newColumnItems } : c
    );

    setOptimisticColumns(columns);
    columnsRef.current = columns;
  }

  function updateColumnItem(
    itemId: string,
    update: Omit<Partial<T[K][0]>, 'id' | 'order'>
  ) {
    const column = columnsRef.current.find((c) =>
      c[key].some((i) => i.id === itemId)
    );
    if (!column) throw new Error('Column not found');
    const item = column[key].find((i) => i.id === itemId);
    if (!item) throw new Error('Item not found');

    const newItem = { ...item, ...update };
    const newColumnTasks = column[key].map((i) =>
      i.id === itemId ? newItem : i
    );
    const columns = columnsRef.current.map((c) =>
      c.id === column.id ? { ...c, [key]: newColumnTasks } : c
    );
    setOptimisticColumns(columns);
    columnsRef.current = columns;
  }

  function updateColumn(
    columnId: string,
    update: Omit<Partial<T>, 'id' | 'order' | K>
  ) {
    const column = columnsRef.current.find((c) => c.id === columnId);
    if (!column) throw new Error('Column not found');

    let newColumn = {
      ...column,
      ...update,
    };
    const columns = columnsRef.current.map((c) =>
      c.id === columnId ? newColumn : c
    );

    setOptimisticColumns(columns);
    columnsRef.current = columns;
  }

  function createColumn(column: MakeOptional<T, 'order'>) {
    const checkColumnExists = columnsRef.current.find(
      (c) => c.id === column.id
    );
    if (checkColumnExists)
      throw new Error(`Column with id:${column.id} already exists`);

    const columns = columnsRef.current;

    let columnOrder = column.order || columns.length + 1;
    if (columnOrder < 1 || columnOrder > columns.length + 1)
      columnOrder = columns.length + 1;

    const newColumn = { ...column, order: columnOrder } as T;

    let newColumns = columns.map((c) =>
      c.id === column.id
        ? column
        : c.order >= columnOrder
        ? { ...c, order: c.order + 1 }
        : c
    );
    newColumns.splice(columnOrder - 1, 0, newColumn);

    setOptimisticColumns(newColumns as T[]);
    columnsRef.current = newColumns as T[];
  }

  function removeColumn(columnId: string) {
    const column = columnsRef.current.find((c) => c.id === columnId);
    if (!column) throw new Error('Column not found');

    const newColumns = columnsRef.current
      .map((c) => (c.order > column.order ? { ...c, order: c.order - 1 } : c))
      .filter((c) => c.id !== columnId);

    setOptimisticColumns(newColumns);
    columnsRef.current = newColumns;
  }

  return {
    columns: optimisticColumns,
    dragEndHandler,
    fns: {
      createColumnItem,
      removeColumnItem,
      updateColumnItem,
      createColumn,
      updateColumn,
      removeColumn,
    },
  };
};
