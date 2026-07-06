import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";

// Fungsi pintar buat nentuin warna badge sesuai status
const getStatusBadge = (status: string) => {
  switch (status) {
    case "Success":
    case "Completed":
      return "bg-[#059669]/10 text-[#059669]";
    case "Processing":
    case "In Progress":
      return "bg-blue-100 text-blue-800";
    case "Dropped": // <-- Tambahan warna buat Dropped
    case "Alert":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default async function LogHistoryPage() {
  // 1. Tarik data Task langsung dari database
  // Diurutkan dari yang paling baru dibuat (descending)
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });

  // 2. Mapping data Task biar formatnya cocok buat masuk ke Tabel Log
  const dynamicLogs = tasks.map((task) => {
    // Format tanggal jadi "Oct 24, 14:20"
    const dateStr = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(task.createdAt));

    // Bikin deskripsi activity makin dinamis ala RPG
    let activityText = "Task Started";
    let detailsText = `Initiated via ${task.offerwall}`;

    if (task.status === "Dropped") {
      activityText = "Quest Abandoned";
      detailsText = "Dropped by user manually";
    } else if (task.status === "Completed") {
      activityText = "Quest Cleared";
      detailsText = "All milestones verified";
    }

    return {
      id: task.id,
      date: dateStr,
      taskName: task.name,
      activity: activityText,
      details: detailsText,
      status: task.status, // <-- Langsung ambil status asli dari DB!
    };
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Log History" />

        <main className="flex-1 p-margin-desktop max-w-container-max mx-auto w-full">
          {/* Header Section */}
          <header className="mb-6">
            <h2 className="text-3xl font-semibold text-primary mb-2">
              Log History
            </h2>
            <p className="text-base text-on-surface-variant max-w-2xl">
              Track your recent activities, task status updates, and payout
              history.
            </p>
          </header>

          {/* Filters & Search Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm">
            <div className="w-full md:w-1/3 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search logs by task or detail..."
                className="w-full pl-10 pr-4 py-2 bg-background border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-auto">
                <select className="w-full md:w-48 appearance-none bg-background border border-outline-variant rounded-lg pl-4 pr-10 py-2 text-sm font-semibold text-on-surface focus:outline-none focus:border-blue-500 transition-colors cursor-pointer">
                  <option value="">All Activity Types</option>
                  <option value="payout">Payouts</option>
                  <option value="status">Status Updates</option>
                  <option value="start">Task Started</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  arrow_drop_down
                </span>
              </div>
              <div className="relative w-full md:w-auto">
                <select className="w-full md:w-40 appearance-none bg-background border border-outline-variant rounded-lg pl-4 pr-10 py-2 text-sm font-semibold text-on-surface focus:outline-none focus:border-blue-500 transition-colors cursor-pointer">
                  <option value="30">Last 30 Days</option>
                  <option value="7">Last 7 Days</option>
                  <option value="90">Last 90 Days</option>
                  <option value="all">All Time</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  arrow_drop_down
                </span>
              </div>
            </div>
          </div>

          {/* Data Table Container */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      Task Name
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant text-sm">
                  {dynamicLogs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-on-surface-variant italic"
                      >
                        Belum ada riwayat aktivitas yang tercatat.
                      </td>
                    </tr>
                  ) : (
                    dynamicLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-surface-container/30 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-on-surface-variant">
                          {log.date}
                        </td>
                        <td className="px-6 py-4 font-medium text-primary">
                          {log.taskName}
                        </td>
                        <td className="px-6 py-4 text-on-surface">
                          {log.activity}
                        </td>
                        <td
                          className={`px-6 py-4 ${
                            log.details.includes("+")
                              ? "text-[#059669] font-semibold"
                              : "text-on-surface-variant"
                          }`}
                        >
                          {log.details}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                              log.status,
                            )}`}
                          >
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="bg-surface-container-lowest border-t border-outline-variant px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <span className="text-sm font-medium text-on-surface-variant">
                Showing {dynamicLogs.length} entries
              </span>
              <div className="flex gap-2">
                <button
                  disabled
                  className="px-3 py-1 border border-outline-variant rounded-md text-sm font-semibold text-on-surface-variant hover:bg-surface transition-colors disabled:opacity-50"
                >
                  Previous
                </button>
                <button className="px-3 py-1 border border-outline-variant rounded-md text-sm font-semibold text-on-surface hover:bg-surface transition-colors bg-surface-container-high">
                  1
                </button>
                <button
                  disabled
                  className="px-3 py-1 border border-outline-variant rounded-md text-sm font-semibold text-on-surface-variant hover:bg-surface transition-colors disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
