export interface IProjectFormErrors {
    title?: string;
    description?: string;
    priority?: string;
    project?: string;
    project_id?: string;
    project_title?: string;
    project_color?: string;
    status?: string;
    due_date?: string;
    isRecurring?: string;
    repeat_every?: string;
    repeat_days?: string[] | string;
    start_date?: string;
    end_date?: string;
    user_id?: string;
  }