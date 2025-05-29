import Dashboard from "@/components/dashboard/Dashboard";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">
          Overview of projects and tasks
        </p>
      </div>
      <div className="mt-6">
        <Dashboard />
      </div>
    </div>
  );
}
