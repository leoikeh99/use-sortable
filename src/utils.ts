import type { Column, DropInfo } from './types';

export function moveColumns<K extends string, T extends Column<K>>(
  columns: T[],
  result: DropInfo
) {
  const { destination, draggableId } = result;
  let newColumns = [...columns];

  if (!destination) throw new Error('Destination index is required');

  const sourceIndex = newColumns.findIndex(
    (column) => column.id === draggableId
  );
  if (sourceIndex === -1) throw new Error('Source column not found');

  const sourceColumn = newColumns[sourceIndex];
  const sourceOrder = sourceColumn.order;
  const destinationOrder =
    destination.index > newColumns.length - 1
      ? newColumns.length
      : destination.index + 1;

  newColumns.splice(sourceIndex, 1); // remove source column
  newColumns.splice(destinationOrder - 1, 0, sourceColumn); // add source column to destination

  newColumns = newColumns.map((column) =>
    column.id === draggableId
      ? { ...column, order: destinationOrder }
      : sourceOrder < destinationOrder &&
        column.order <= destinationOrder &&
        column.order > sourceOrder
      ? { ...column, order: column.order - 1 }
      : sourceOrder > destinationOrder &&
        column.order >= destinationOrder &&
        column.order < sourceOrder
      ? { ...column, order: column.order + 1 }
      : column
  );

  return newColumns;
}

export function moveItems<K extends string, T extends Column<K>>(
  columns: T[],
  key: K,
  result: DropInfo
) {
  const { source, destination, draggableId } = result;

  if (!destination) throw new Error('Destination index is required');

  const column = columns.find((c) => c.id === source.droppableId);
  if (!column) throw new Error('Column not found');

  const columnItems = column[key];

  const sourceIndex = columnItems.findIndex((i) => i.id === draggableId);
  if (sourceIndex === -1) throw new Error('Source item not found');

  const sourceItem = columnItems[sourceIndex];
  const sourceOrder = columnItems[sourceIndex].order;
  const destinationOrder =
    destination.index > columnItems.length - 1
      ? columnItems.length
      : destination?.index + 1;

  let newItems = [...columnItems];

  newItems.splice(sourceIndex, 1); // remove source item
  newItems.splice(destinationOrder - 1, 0, sourceItem); // add source item to destination

  newItems = newItems.map((item) =>
    item.id === draggableId
      ? { ...item, order: destinationOrder }
      : sourceOrder < destinationOrder &&
        item.order <= destinationOrder &&
        item.order > sourceOrder
      ? { ...item, order: item.order - 1 }
      : sourceOrder > destinationOrder &&
        item.order >= destinationOrder &&
        item.order < sourceOrder
      ? { ...item, order: item.order + 1 }
      : item
  );

  const newColumns = [...columns].map((c) =>
    c.id === source.droppableId ? { ...c, [key]: newItems } : c
  );

  return newColumns;
}

export function moveItemToColumn<K extends string, T extends Column<K>>(
  columns: T[],
  key: K,
  result: DropInfo
) {
  const { source, destination, draggableId } = result;

  if (!destination?.droppableId)
    throw new Error('Destination droppableId is required');

  const sourceColumn = columns.find((c) => c.id === source.droppableId);
  if (!sourceColumn) throw new Error('Source column not found');

  const destinationColumn = columns.find(
    (c) => c.id === destination.droppableId
  );
  if (!destinationColumn) throw new Error('Destination column not found');

  const sourceItemIndex = sourceColumn[key].findIndex(
    (i) => i.id === draggableId
  );
  if (sourceItemIndex === -1) throw new Error('Source item not found');

  const sourceItem = sourceColumn[key][sourceItemIndex];
  const sourceItemOrder = sourceItem.order;
  const destinationItemIndex =
    destination.index > destinationColumn[key].length
      ? destinationColumn[key].length
      : destination.index;

  let newSourceTasks = [...sourceColumn[key]];
  let newDestinationTasks = [...destinationColumn[key]];

  // remove item from source column
  newSourceTasks.splice(sourceItemIndex, 1);

  //update order of items in source column
  newSourceTasks = newSourceTasks.map((item) => {
    return {
      ...item,
      order: sourceItemOrder < item.order ? item.order - 1 : item.order,
    };
  });

  if (destination.index < newDestinationTasks.length) {
    //if not added to the end of the destination column
    newDestinationTasks = newDestinationTasks.map((item) =>
      item.order >= destinationItemIndex + 1
        ? { ...item, order: item.order + 1 }
        : item
    );
  }

  newDestinationTasks.splice(destinationItemIndex, 0, {
    ...sourceColumn[key][sourceItemIndex],
    order: destinationItemIndex + 1,
  });

  const newColumns = columns.map((c) =>
    c.id === source.droppableId
      ? { ...c, [key]: newSourceTasks }
      : c.id === destination.droppableId
      ? { ...c, [key]: newDestinationTasks }
      : c
  );

  return newColumns;
}

export function isFinalOperation(
  asyncOperations: string[],
  operationId: string
) {
  if (
    asyncOperations.findIndex((id) => id === operationId) ===
    asyncOperations.length - 1
  )
    return true;
  return false;
}
