# Use Sortable

A react hook used in sorting and managing data in Drag n Drop layouts, it allows sorting and reordering of items within its column and also across multiple columns, it also allows the reordering of columns in the context. this hook also reorder based on the data type **order**, this allows the persistence of the DnD layout with the backend of your application. This hook can also be used with any react Drag n Drop library as long as the input type is consistent.

## Features

- Allows sorting and reordering of items within its column and also across multiple columns
- Allows the reordering of columns in the context
- Sorts based on the data type **order**, this allows the persistence of the DnD layout with the backend of your application
- Can be used with any react Drag n Drop library as long as the input type is consistent
- Uses update functions to persist data on your backend, while using optimistic updates.
- Reverts optimistic updates in the event of an error.

# Installation

Using npm:

```
$ npm install @wazza99/use-sortable
```

## Data Structure

Using a data structure where we can have multiple columns and each columns could contain multiple items.

```mermaid
graph TB
C[Columns] --> C1
C[Columns] --> C2
C1[Column 1]  --> I1[Item 1]
C1[Column 1]  --> I2[Item 2]
C1[Column 1]  --> I3[Item 3]
C2[Column 2]  --> I4[Item 4]
C2[Column 2]  --> I5[Item 5]
C2[Column 2]  --> I6[Item 6]
```

## Usage

### Basic

```typescript
import { useSortable } from '@wazza99/use-sortable';

//initial data
const initialColumns= [
	{
	id:  'column1',
	order:  1,
	name:  'Todo',
	tasks: [
		{
			id:'task1',
			title:'Task 1 title',
			order:1,
			//other data points...
		},
		{
			id:'task2',
			title:'Task 2 title',
			order:2,
		}
	],
	//other data points...
 },
	{
	id:  'column2',
	order:  2,
	name:  'In-Progress',
	tasks:[
		{
			id:"task3",
			order:1
			title:"Task 3 title"
		}
	]
	}
	]

const { columns, dragEndHandler, fns} = useSortable(initialColumns, 'tasks');

const options = { reorderColumn:true, columnsDroppableId:'all-columns' }

const  handleDrag = (result) => {
	dragEndHandler( result, options );
};
```

### The result parameter

The result parameter is of type `DropInfo` which contains the `destination` and `source` information of the dropped item, it also contains the `draggableId` of the dropped item. The result parameter will look something like this:

```typescript
const result = {
  destination: { droppableId: 'column1', index: 1 },
  source: { droppableId: 'column1', index: 0 },
  draggableId: 'task1',
};
```

Its important that no matter the DnD library you use, the result data you pass in after a drag drop operation should always look like this.

### With optimistic updates

```typescript
async function updateItem(values: OptimisticItemData) {
  //values contains the previous and current optimistc info of the dropped item, you can use this to update your backend
  const data = await createPromise(values, 3000);
}

async function updateColumn(values: OptimisticColumnData) {
  const data = await createPromise(values, 3000);
}

const options = { reorderColumns: true, columnsDroppableId: 'all-columns' };
const updates = { updateItem, updateColumn };

const handleDrag = (result) => {
  dragEndHandler(result, options, updates);
};
```

### Helper functions

```typescript
const { columns, dragEndHandler, fns } = useSortable(initialColumns, 'tasks');

// Example usage of the functions
fns.createColumnItem('column2', { id: 'task4', title: 'Task 4 title' });
fns.removeColumnItem('task1');
fns.updateColumnItem('task1', { title: 'New title' });
fns.createColumn({ id: 'column2', name: 'Doing', tasks: [] });
fns.updateColumn('column2', { name: 'New name' });
fns.removeColumn('column2');
```

## API

#### Parameters

| Parameter        | Type     | Description                               |
| ---------------- | -------- | ----------------------------------------- |
| `initialColumns` | `array`  | Initial set of columns.                   |
| `key`            | `string` | Key to identify the items key in columns. |

### Returns

| Property         | Type       | Description                                         |
| ---------------- | ---------- | --------------------------------------------------- |
| `columns`        | `array`    | The state of sorted columns and items.              |
| `dragEndHandler` | `function` | Function to handle drag end events.                 |
| `fns`            | `object`   | Object containing functions to manipulate columns . |

### `fns` Object

| Function           | Description                                 | Type       |
| ------------------ | ------------------------------------------- | ---------- |
| `createColumnItem` | Creates a new item in the specified columnn | `function` |
| `removeColumnItem` | Removes an item from the columns.           | `function` |
| `updateColumnItem` | Updates an item in the columns.             | `function` |
| `createColumn`     | Creates a new column.                       | `function` |
| `updateColumn`     | Updates a column.                           | `function` |
| `removeColumn`     | Removes a column.                           | `function` |

## Important Notes

- All `columns` and `items` must have a unique `Id` and and initial `order`.
- If using a DnD react library, it is important that the draggable `id` of every item is the same as its `item id`, this also applies in the case of `columns`.
- Any sort of data could be passed into `columns` or `items`, but it is required they each have an `order` and a unique `id`, it is also required that each `column` have an array of i`tems`.

### Live example

This example uses [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) as the DnD library.

- [Live Site](https://use-sortable-example.netlify.app/)
- [Code](https://github.com/leoikeh99/use-sortable/tree/main/example)

## Contributing

Contributions are welcome in this project, follow the steps below to get started.

1. Fork the project
2. Create a new branch for your feature or bug fix
3. Commit your changes and push to your forked repo
4. Submit a pull request

Please note that before writing any code, it's a good idea to discuss the change you wish to make via an issue or a pull request. This will help prevent wasted time and ensure that your changes are in line with the project's goals.
