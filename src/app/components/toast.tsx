"use client";
import { useCallback, useEffect, useState } from "react";

type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  title: string;
  description: string;
  onClose?: () => void;
  className?: string;
  variant?: ToastVariant;
  duration?: number;
  showCloseButton?: boolean;
  icon?: React.ReactNode; 
}

const variantStyles: Record<ToastVariant, string> = {
  default: 'bg-white border-[#CCCCCC]',
  success: 'bg-green-50 border-green-200',
  error: 'bg-red-50 border-red-200',
  warning: 'bg-amber-50 border-amber-200',
  info: 'bg-blue-50 border-blue-200',
};

const variantTextColors: Record<ToastVariant, string> = {
  default: 'text-text',
  success: 'text-green-700',
  error: 'text-red-700',
  warning: 'text-amber-700',
  info: 'text-blue-700',
};

export function Toast({
  title,
  description,
  onClose,
  className = '',
  variant = 'default',
  duration = 5000,
  showCloseButton = true,
  icon,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showCloseButtonHover, setShowCloseButtonHover] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    if (isExiting) return;
    
    setIsExiting(true);
    // Wait for exit animation to complete before calling onClose
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300); // Match this with your CSS transition duration
  }, [isExiting, onClose]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`relative flex flex-col gap-2 p-4 rounded-md shadow-md transition-all duration-300 transform ${
        isExiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
      } ${variantStyles[variant]} ${className}`}
      onMouseEnter={() => setShowCloseButtonHover(true)}
      onMouseLeave={() => setShowCloseButtonHover(false)}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {icon && <div className="mt-0.5">{icon}</div>}
          <div>
            <h3 className={`text-sm font-semibold ${variantTextColors[variant]}`}>
              {title}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {description}
            </p>
          </div>
        </div>
        
        {(showCloseButton || showCloseButtonHover) && (
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
            aria-label="Close"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
            >
              <path 
                d="M11.5 4.5L4.5 11.5M11.5 11.5L4.5 4.5" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export const SuccessToast = (props: Omit<ToastProps, 'variant'>) => (
  <Toast {...props} variant="success" />
);
export const ErrorToast = (props: Omit<ToastProps, 'variant'>) => (
  <Toast {...props} variant="error" />
);

export const WarningToast = (props: Omit<ToastProps, 'variant'>) => (
  <Toast {...props} variant="warning" />
);
export const InfoToast = (props: Omit<ToastProps, 'variant'>) => (
  <Toast {...props} variant="info" />
);
