export interface INotificationProps {
  type: 
    | "achievement"
    | "milestone"
    | "streak"
    | "levelUp"
    | "bigReward"
    | "dueTomorrow"
    | "taskCompleted"
    | "smallReward";
  title: string;
  message: string;
  time: string;
  status: string;
  onAcknowledge?: () => void; 
}
