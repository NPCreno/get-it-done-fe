export interface IProject {
    title: string;
    description: string;
    due_date: Date;
    tasks: number;
    project_id?: string;
    color?: string;
    task_count?: number;
    completed_tasks?: number;
    updatedAt?: string;
    createdAt?: string;
  }