import DashboardSidebar from "../components/dashboardCompnents/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col md:flex-row text-gray-300">
      <DashboardSidebar />
      <main className="flex-1 p-4 md:p-8 lg:p-10 w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}