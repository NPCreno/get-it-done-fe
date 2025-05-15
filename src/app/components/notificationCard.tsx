"use client"
import { INotificationProps } from "../interface/INotification";
import Image from "next/image";

export default function NotificationCard({
  type,
  title,
  message,
  time,
  onAcknowledge,
  status,
}: INotificationProps) {
  const hasAction = ["achievement", "milestone", "streak", "levelUp", "bigReward"].includes(type);
  const getIconByType = (type: INotificationProps["type"]) => {
  switch (type) {
    case "achievement":
      return "/svgs/notifIcons/trophy-yellow.svg";
    case "milestone":
      return "/svgs/notifIcons/ribbon-steel.svg";
    case "streak":
      return "/svgs/notifIcons/fire-orange.svg";
    case "levelUp":
      return "/svgs/notifIcons/star-teal.svg";
    case "bigReward":
      return "/svgs/notifIcons/medal-red.svg";
    case "dueTomorrow":
      return "/svgs/notifIcons/calendar-yellow.svg";
    case "taskCompleted":
      return "/svgs/notifIcons/check-green.svg";
    case "smallReward":
      return "/svgs/notifIcons/clock-teal.svg";
    default:
      return "/svgs/notifIcons/check-green.svg";
  }
};
  return (
    <div className={`border-[2px] border-border p-[10px] h-[auto] rounded-[10px] bg-white flex justify-between items-start w-full ${status === "unread" ? "cursor-pointer" : ""}`}>
        <div className="flex flex-row gap-[10px]">
            {/* blue line */}
            <div className={`min-w-[5px] min-h-full rounded bg-secondary-default ${status === "unread" ? "bg-secondary-default" : "bg-white"}`}></div>
            
            {/* Icon */}
            <div className="flex items-start">
                <Image
                src={getIconByType(type)}
                width={40}
                height={40}
                alt={"test"}
                />
            </div>
        
            
            {/* Contents */}
            <div className="flex flex-col w-full gap-[10px]">
                <div className="flex flex-col">
                    <h1 className="font-lato font-bold text-[13px] text-black">{title}</h1>
                    <span className="font-lato font-normal text-xs text-black">{message}</span>
                </div>
                {hasAction && (
                    <button
                    onClick={()=>{onAcknowledge}}
                    className="flex flex-row gap-[5px] px-[10px] h-[30px] w-[95px] bg-background font-lato text-[10px] text-black items-center rounded-[5px]"
                    >
                    <Image
                        src={'/svgs/notificons/checkmark-circle-outline.svg'}
                        width={10}
                        height={10}
                        alt={"test"}
                    />
                        Acknowledge
                    </button>
                )}
            </div>
        </div>

        <div className="flex items-start font-lato text-[10px] text-text gap-5">
            <span className="">{time}</span>
             <Image
                src={"/svgs/notifIcons/x.svg"}
                width={10}
                height={10}
                alt={"exit"}
                className="cursor-pointer"
            />
        </div>
      </div>
  );
}
