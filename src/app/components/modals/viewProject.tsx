import React from 'react';
import { IProject } from '@/app/interface/IProject';
import { ITask } from '@/app/interface/ITask';

interface ViewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: IProject;
  handleCreateTask: () => void;
}

export default function ViewProjectModal({ 
  isOpen, 
  onClose, 
  project, 
  handleCreateTask,
}: ViewProjectModalProps) {
  // const [tasks, setTasks] = useState<ITask[]>([]);
  const tasks: ITask[] = [
    {
      project_id: 'proj-001',
      task_id: 'task-001',
      title: 'Design Login Page',
      description: 'Create wireframes and high-fidelity mockups for the login screen.',
      due_date: new Date('2025-06-05'),
      status: 'To Do',
      priority: 'High',
    },
    {
      project_id: 'proj-001',
      task_id: 'task-002',
      title: 'API Authentication',
      description: 'Implement JWT-based authentication for the backend.',
      due_date: new Date('2025-06-10'),
      status: 'To Do',
      priority: 'High',
    },
    {
      project_id: 'proj-002',
      task_id: 'task-003',
      title: 'Database Schema Design',
      description: 'Design the initial database schema for the application.',
      due_date: new Date('2025-06-03'),
      status: 'Completed',
      priority: 'Medium',
    },
    {
      project_id: 'proj-002',
      task_id: 'task-004',
      title: 'Frontend Setup',
      description: 'Set up Angular project structure and shared components.',
      due_date: new Date('2025-06-07'),
      status: 'To Do',
      priority: 'Medium',
    },
    {
      project_id: 'proj-003',
      task_id: 'task-005',
      title: 'User Dashboard',
      description: 'Develop dashboard components with dynamic data rendering.',
      due_date: new Date('2025-06-15'),
      status: 'To Do',
      priority: 'High',
    },
    {
      project_id: 'proj-003',
      task_id: 'task-006',
      title: 'Unit Testing',
      description: 'Write unit tests for core services and components.',
      due_date: new Date('2025-06-12'),
      status: 'To Do',
      priority: 'Low',
    },
    {
      project_id: 'proj-004',
      task_id: 'task-007',
      title: 'CI/CD Integration',
      description: 'Integrate GitHub Actions for automatic deployment.',
      due_date: new Date('2025-06-20'),
      status: 'To Do',
      priority: 'Medium',
    },
    {
      project_id: 'proj-004',
      task_id: 'task-008',
      title: 'Bug Fixing',
      description: 'Resolve reported issues from internal testing.',
      due_date: new Date('2025-06-08'),
      status: 'Completed',
      priority: 'High',
    },
    {
      project_id: 'proj-005',
      task_id: 'task-009',
      title: 'Performance Optimization',
      description: 'Profile and optimize page load times.',
      due_date: new Date('2025-06-18'),
      status: 'To Do',
      priority: 'Medium',
    },
    {
      project_id: 'proj-005',
      task_id: 'task-010',
      title: 'Documentation',
      description: 'Write comprehensive documentation for developers.',
      due_date: new Date('2025-06-25'),
      status: 'Completed',
      priority: 'Low',
    }
  ];

  
  if (!isOpen) return null;
  
  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  window.addEventListener('keydown', handleEscapeKey);

  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="modal-popup bg-white w-[550px] h-auto rounded-[10px] p-5 shadow-lg flex flex-col gap-5 "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-text text-[20px] font-bold font-lato">{project.title}</h1>
                <button className="cursor-pointer" onClick={onClose}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.5 4.50098L4.5 11.501M11.5 11.501L4.5 4.50098L11.5 11.501Z" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
            </div>
            <h2 className="text-[#676767] text-sm font-lato">{project.description ? project.description : "View and manage tasks in this project"}</h2>
        </div>

        <div className="flex flex-col gap-[10px] max-h-[710px] overflow-y-auto scrollbar-hide">
          {tasks.map((task) => (
            <TaskCard key={task.task_id} {...task} />
          ))}
        </div>

        <div className="flex flex-row justify-between w-full  items-center">
              <button className="bg-primary-default rounded-[5px] flex justify-center items-center text-white font-lato 
                text-xs p-[10px]" onClick={handleCreateTask}>
                  <svg width="20" height="20" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.7501 12.499H5.25012M12.0001 5.74902V19.249V5.74902Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>

                  New Task
              </button>
              
              <button className="border border-primary-200 rounded-[5px] flex justify-center items-center text-primary-default 
              font-lato text-xs p-[10px]" onClick={onClose}>Cancel</button>
                
        </div>
      </div>
    </div>
  );
}


const TaskCard = (task: ITask) => {

  const priorityColor = task.priority === "High" ? "bg-red-500" : task.priority === "Medium" ? "bg-accent-default" : "bg-secondary-default";
  const statusColor = task.status === "To Do" ? "bg-accent-200" : "bg-green-200";
  const statusTextColor = task.status === "To Do" ? "text-accent-600" : "text-green-700";

  const handleRevertStatus = (task_id: string) => {
    console.log("Revert Status", task_id);
  }

  const handleCompleteTask = (task_id: string) => {
    console.log("Complete Task", task_id);
  }

  return (
    <div className="border border-[#E0E0E0] rounded-[10px] py-2 px-5 flex flex-row">
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-row gap-[10px] items-center">
          <div className={`w-[10px] h-[10px] rounded-full mr-4 ${task.status == "Completed" ? "bg-green-400" : priorityColor}`} 
          ></div>
          <div className="flex flex-col gap-[10px]">
            <div className="flex flex-row gap-[10px]">
              <h1 className={`text-sm font-bold font-lato ${task.status == "Completed" ? "line-through text-[#828282]" : "text-text"}`}>{task.title}</h1>
              <div className={`${statusColor} h-[18px] rounded-full px-1 ${statusTextColor} text-[11px] font-lato font-bold ${task.status == "Completed" ? "line-through" : ""}`}>
                {task.status}
              </div>
            </div>
            <h1 className="text-[#828282] text-xs font-bold font-lato">{task.description}</h1>
          </div>
        </div>

        {task.status != "Completed" ?(
          <div className="h-full flex items-center">
            <div className="border-[2px] border-solid rounded-[10px] border-primary-200 w-5 h-5 flex items-center justify-center cursor-pointer">
              <input
                id="checkTask"
                type="checkbox"
                className="appearance-none w-full h-full checked:bg-primary-200 checked:border-white checked:border-solid 
                        border-[2px] rounded-[10px] relative cursor-pointer"
                onClick={() => handleCompleteTask(task.task_id)}
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center cursor-pointer" onClick={() => handleRevertStatus(task.task_id)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 1C5.47917 1 1 5.47917 1 11C1 16.5208 5.47917 21 11 21C16.5208 21 21 16.5208 21 11C21 5.47917 16.5208 1 11 1Z" stroke="#FED580" stroke-width="1.5" stroke-miterlimit="10"/>
            <path d="M10.9998 5.42706L13.0831 7.5104L10.9998 9.59373" stroke="#FED580" stroke-width="1.3125" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12.6663 7.71771C12.6663 7.71771 13.3007 7.40521 10.9997 7.40521C10.1756 7.40521 9.37001 7.64958 8.6848 8.10742C7.9996 8.56526 7.46554 9.21601 7.15018 9.97737C6.83481 10.7387 6.7523 11.5765 6.91307 12.3848C7.07384 13.193 7.47068 13.9354 8.0534 14.5182C8.63612 15.1009 9.37855 15.4977 10.1868 15.6585C10.9951 15.8193 11.8328 15.7367 12.5942 15.4214C13.3556 15.106 14.0063 14.572 14.4641 13.8868C14.922 13.2016 15.1663 12.396 15.1663 11.5719" stroke="#FED580" stroke-width="1.3125" stroke-miterlimit="10" stroke-linecap="round"/>
            </svg>
          </div>
        )}

      </div>
    </div>
  )
}