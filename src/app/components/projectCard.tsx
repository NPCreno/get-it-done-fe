import { IProject } from "../interface/IProject";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// Helper functions for colors and gradients
const getGradientClass = (color: string = 'gray') => {
  const gradientMap: Record<string, string> = {
    'red': 'from-red-50 to-red-100',
    'blue': 'from-blue-50 to-blue-100',
    'green': 'from-green-50 to-green-100',
    'yellow': 'from-yellow-50 to-yellow-100',
    'purple': 'from-purple-50 to-purple-100',
    'pink': 'from-pink-50 to-pink-100',
    'indigo': 'from-indigo-50 to-indigo-100',
    'gray': 'from-gray-50 to-gray-100',
  };
  return gradientMap[color.toLowerCase()] || 'from-gray-50 to-gray-100';
};

const getTextColor = (color: string = 'gray') => {
  const textMap: Record<string, string> = {
    'red': 'text-red-700',
    'blue': 'text-blue-700',
    'green': 'text-green-700',
    'yellow': 'text-yellow-700',
    'purple': 'text-purple-700',
    'pink': 'text-pink-700',
    'indigo': 'text-indigo-700',
    'gray': 'text-gray-700',
  };
  return textMap[color.toLowerCase()] || 'text-gray-700';
};

export default function ProjectCard({
  project,
  onClick,
  onAddTaskClick,
  onEditClick,
  onDeleteClick,
}: {
  project: IProject & { priority?: 'high' | 'medium' | 'low' | string };
  onClick: () => void;
  onAddTaskClick: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}) {
  const [showActions, setShowActions] = useState(false);
  const projectColor = project.color?.toLowerCase() || 'gray';
  const gradientClass = getGradientClass(projectColor);
  const textColor = getTextColor(projectColor);
  const progress = project.task_count 
    ? Math.round(((project.task_completed ?? 0) / project.task_count) * 100) 
    : 0;
  
  const dueDate = project.due_date ? new Date(project.due_date) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const daysUntilDue = dueDate ? Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;
  const isDueSoon = dueDate && daysUntilDue !== null && daysUntilDue <= 3 && daysUntilDue >= 0;
  const isOverdue = dueDate && daysUntilDue !== null && daysUntilDue < 0;
  const hasDueDate = dueDate && !isOverdue;
  const priority = project.priority || 'none';
  
  // Mock team members - replace with actual data
  const teamMembers = [
    { id: 1, name: 'User 1', avatar: 'U1' },
    { id: 2, name: 'User 2', avatar: 'U2' },
  ];

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`group relative p-5 rounded-2xl bg-gradient-to-br ${gradientClass} 
        border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 
        cursor-pointer overflow-hidden relative ${
          progress >= 100 
            ? 'shadow-[0_0_20px_5px_rgba(52,211,153,0.3)]' 
            : progress >= 80 
              ? 'shadow-[0_0_15px_3px_rgba(52,211,153,0.2)]' 
              : ''
        }`}
    >
      {/* Glow effect for completed projects */}
      {progress >= 80 && (
        <motion.div 
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: progress >= 100 ? 0.3 : progress >= 90 ? 0.2 : 0.1,
            boxShadow: progress >= 100 
              ? '0 0 40px 20px rgba(52, 211, 153, 0.5)'
              : progress >= 90 
                ? '0 0 30px 10px rgba(52, 211, 153, 0.3)'
                : '0 0 20px 5px rgba(52, 211, 153, 0.2)'
          }}
          transition={{ 
            duration: 2,
            repeat: progress >= 100 ? Infinity : 0,
            repeatType: 'reverse'
          }}
        />
      )}
      {/* Animated gradient overlay on hover */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/10 transition-all duration-500"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />
      {/* Header with title and menu button */}
      <div className="flex justify-between items-start gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {project.title}
            </h2>
            {priority !== 'none' && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${textColor} bg-opacity-20`}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </span>
            )}
          </div>
          
          <div className="min-h-[40px]">
            {project.description ? (
              <p className="text-sm text-gray-600 line-clamp-2">
                {project.description}
              </p>
            ) : <div className="h-5"></div>}
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 text-white/70 hover:text-white"
            aria-label="More options"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <AnimatePresence>
            {showActions && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-10 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditClick?.();
                    setShowActions(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4V20H20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Edit Project
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick?.();
                    setShowActions(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Completion Status */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">
            {project.task_completed ?? 0} of {project.task_count || 0} tasks completed
            {progress >= 100 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                Completed!
              </span>
            )}
          </span>
          <span className="text-xs text-gray-500">
            {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : ''}
          </span>
        </div>
      </div>

      {/* Footer */}
      <motion.div 
        className="flex items-center justify-between pt-4 mt-3 border-t border-white/10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Team avatars */}
        <div className="flex -space-x-2">
          {teamMembers.map((member) => (
            <div 
              key={member.id}
              className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-xs font-medium text-gray-700 border-2 border-white"
              title={member.name}
            >
              {member.avatar}
            </div>
          ))}
          <motion.button 
            className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-xs text-gray-700 border-2 border-white hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onAddTaskClick();
            }}
            title="Add new task"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-current">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </div>

        {/* Quick actions */}
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <motion.button 
            onClick={(e) => {
              e.stopPropagation();
              onAddTaskClick();
            }}
            className="relative px-4 py-2 flex flex-row gap-2 items-center justify-center rounded-xl h-[36px] font-medium text-white 
                     bg-gradient-to-r from-primary-default to-primary-200 shadow-sm hover:shadow-md
                     transform transition-all duration-300 hover:translate-y-[-1px] active:translate-y-0 active:scale-95 overflow-hidden group
                     before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary-200 before:to-primary-default
                     before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
          >
            
            {/* Plus icon with subtle animation */}
            <div className="relative z-10 flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-300 group-hover:rotate-90"
              >
                <path
                  d="M18.7501 12.499H5.25012M12.0001 5.74902V19.249"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                />
              </svg>
            </div>
            
            {/* Button text with subtle tracking */}
            <span className="relative z-10 text-sm font-medium">Add Task</span>
            
            {/* Subtle shine effect on hover */}
            <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></span>
          </motion.button>
          
          {dueDate && (
            <motion.div 
              className={`flex items-center text-xs px-3 py-1.5 rounded-xl border shadow-sm ${
                isOverdue || daysUntilDue === 0
                  ? 'bg-error-100 text-error-700 border-error-200' 
                  : daysUntilDue === 1
                    ? 'bg-error-100 text-error-700 border-error-200'
                    : daysUntilDue === 3
                      ? 'bg-accent-100 text-accent-700 border-accent-200'
                      : 'bg-white/90 text-gray-800 border-white/30'
              }`}
              whileHover={{ y: -1 }}
            >
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="mr-1.5" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Decorative elements */}
      <motion.div 
        className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/20"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
      />
      <motion.div 
        className="absolute -right-3 -bottom-3 w-12 h-12 rounded-full bg-white/30"
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
