
export interface TaskType {
  id: number;
  title: string;
  completed: boolean;
}

export type TabType = "All" | "To Do" | "Completed";


export interface MenuButtonType {
  name: TabType;
}
