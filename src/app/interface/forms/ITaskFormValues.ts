export interface ITaskFormValues {
    user_id: string;
    project_id?: string | null;
    project_title: string;
    project_color: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    due_date?: Date | null;
    isRecurring: boolean;
    repeat_every: string;
    repeat_days: string[];
    start_date: Date | null;
    end_date: Date | null;
    project: string;
    task_id?: string;
  } 