export interface ITask {
    project_id: string;
    task_id: string;
    title: string;
    description: string;
    due_date: Date;
    status: 'Pending' | 'Completed' | 'Overdue';
    priority: string;
    project_title?: string;
}
