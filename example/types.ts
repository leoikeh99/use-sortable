export type MyTask = {
  id: string;
  title: string;
  order: number;
};

export type MyColumn = {
  id: string;
  order: number;
  name: string;
  tasks: MyTask[];
};

export type AddTaskItem = {
  id: string;
  title: string;
  order?: number;
};
