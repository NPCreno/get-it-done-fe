"use client"
import MainLayout from "@/app/components/MainLayout";
import NotificationCard from "@/app/components/notificationCard";
import { INotificationProps } from "@/app/interface/INotification";


export default function NotificationsPage() {

const rawNotifications: Omit<INotificationProps, 'status'>[] = [
  {
    type: 'achievement',
    title: '🏆 Achievement Unlocked!',
    message: "You've completed 50 tasks!",
    time: '2h ago',
    onAcknowledge: () => alert('Achievement acknowledged'),
  },
  {
    type: 'milestone',
    title: 'Milestone Reached!',
    message: 'Halfway through Project Apollo!',
    time: '1d ago',
    onAcknowledge: () => alert('Milestone acknowledged'),
  },
  {
    type: 'streak',
    title: '7-Day Streak! 🔥',
    message: "You've been productive for 7 days straight!",
    time: '3h ago',
    onAcknowledge: () => alert('Streak acknowledged'),
  },
  {
    type: 'levelUp',
    title: 'Level Up!',
    message: "You've reached Productivity Level 3!",
    time: '5h ago',
    onAcknowledge: () => alert('Level up acknowledged'),
  },
  {
    type: 'bigReward',
    title: 'Big Reward Available 🎁',
    message: 'You can redeem your weekly reward now!',
    time: '30m ago',
    onAcknowledge: () => alert('Big reward acknowledged'),
  },
  {
    type: 'dueTomorrow',
    title: 'Task Due Tomorrow',
    message: 'Finish "Client Report" before 5 PM tomorrow.',
    time: '10m ago',
  },
  {
    type: 'taskCompleted',
    title: 'Task Completed',
    message: 'You completed "Design Dashboard Mockup".',
    time: '1h ago',
  },
  {
    type: 'smallReward',
    title: 'Small Reward Unlocked 🎉',
    message: "You've earned a coffee break token!",
    time: '4h ago',
  },
  {
    type: 'taskCompleted',
    title: 'Task Completed',
    message: 'Finished reading "Deep Work".',
    time: '2d ago',
  },
  {
    type: 'dueTomorrow',
    title: 'Task Due Tomorrow',
    message: "Prepare agenda for Thursday's standup.",
    time: '3h ago',
  },
]

const notifications: INotificationProps[] = rawNotifications.map((notif) => ({
  ...notif,
  status: Math.random() < 0.5 ? 'read' : 'unread',
}));

  return (
    <MainLayout>
      <div className="main flex justify-center w-full flex-col overflow-y-auto">
        {/* Main Page */}
        <div className="inside max-w-[1440px] w-full mx-auto gap-5 flex flex-col ">
          <div className="flex justify-between">
            {/* Left header */}
            <div className="flex flex-col">
              <h1 className="text-[28px] font-bold text-primary-default fade-in select-none">
                Notifications
              </h1>
              <p className="font-lato text-[13px] text-text fade-in-delay-2 select-none">
                Never Miss an Important Update
              </p>
            </div>

            <div className="flex font-lato font-bold text-[13px] fade-in-delay-2 text-text cursor-pointer items-end"> 
              Mark all as read
            </div>  
          </div>


          {/* Main contents */}
          <div className="flex flex-col gap-[10px] overflow-y-auto fade-in-delay max-h-[calc(100vh-130px)] pr-2 hide-scrollbar">
            {notifications.map((notif, index) => (
              <NotificationCard key={index} {...notif} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
