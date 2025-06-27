
export interface IProjectOrTaskFormValues {
    title: string;
    description: string;
    due_date: Date | null;
    colorLabel: string;
    color: string;
    user_id: string;
    project_id: string;
    project_title: string;
    project_color: string;
    priority: string;
    status: string;
    isRecurring: boolean;
    repeat_every: string;
    repeat_days: string[];
    start_date: Date | null;
    end_date: Date | null;
    project: string;
    task_id?: string;
  }