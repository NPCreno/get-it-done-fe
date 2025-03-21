import MainLayout from "@/app/components/MainLayout";

export default function DashboardPage() {
  return (
    <MainLayout>
      <h1 className="text-[28px] font-bold text-primary-default">Dashboard</h1>
      <p className="font-lato text-[13px] text-text">
        Track your tasks and monitor your progress
      </p>
    </MainLayout>
  );
}
