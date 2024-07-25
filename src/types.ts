export type Item = {
  id: string;
  order: number;
};

export type Column<K extends string> = {
  id: string;
  order: number;
} & {
  [key in K]: Item[];
};

export type Options = {
  reorderColumns: boolean;
  columnsDroppableId?: string;
};

export type ItemState = {
  index: number;
  order: number;
  columnId: string;
};

export type ColumnState = {
  index: number;
  order: number;
};

export type OptimisticItemData = {
  itemId: string;
  oldState: ItemState;
  newState: ItemState;
};

export type OptimisticColumnData = {
  columnId: string;
  oldState: ColumnState;
  newState: ColumnState;
};

export type UpdateItem = (value: OptimisticItemData) => Promise<void>;
export type UpdateColumn = (value: OptimisticColumnData) => Promise<void>;

export type Updates<B extends Boolean> = B extends true
  ? {
      updateItem: UpdateItem;
      updateColumn: UpdateColumn;
    }
  : { updateItem: UpdateItem };

export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type Location = {
  droppableId: string;
  index: number;
};

export type DropInfo = {
  destination: Location | null;
  source: Location;
  draggableId: string;
};
