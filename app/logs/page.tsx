import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";

// Fungsi pintar buat nentuin warna badge sesuai status, udah disupport Neo-Brutalism
const getStatusBadge = (status: string) => {
  switch (status) {
    case "Success":
    case "Completed":
      return "bg-[#A3E635] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]";
    case "Processing":
    case "In Progress":
      return "bg-[#93C5FD] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]";
    case "Dropped":
    case "Alert":
      return "bg-[#FCA5A5] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]";
    default:
      return "bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]";
  }
};

export default async function LogHistoryPage() {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });

  const dynamicLogs = tasks.map((task) => {
    const dateStr = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(task.createdAt));

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
      status: task.status,
    };
  });

  return (
    <div className="flex min-h-screen bg-[#F4F5F0] dark:bg-[#0B1120] text-black dark:text-white transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header title="Log History" />

        <main className="flex-1 p-margin-desktop max-w-container-max mx-auto w-full">
          {/* Header Section */}
          <header className="mb-8">
            <h2 className="text-4xl font-black text-black dark:text-white mb-2 uppercase">
              Log History
            </h2>
            <p className="text-base font-bold text-slate-700 dark:text-slate-400 max-w-2xl">
              Track your recent activities, task status updates, and payout
              history.
            </p>
          </header>

          {/* Filters & Search Toolbar - Neo Brutalism */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 bg-white dark:bg-slate-900 p-4 rounded-md border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-colors duration-300">
            <div className="w-full md:w-1/3 relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-black dark:text-slate-400 text-[20px] font-black">
                search
              </span>
              <input
                type="text"
                placeholder="Search logs by task or detail..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#F4F5F0] dark:bg-slate-800 border-2 border-black dark:border-white rounded-sm text-sm font-bold text-black dark:text-white placeholder-slate-500 focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] focus:-translate-y-1 transition-all"
              />
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-auto">
                <select className="w-full md:w-48 appearance-none bg-[#FCD34D] border-2 border-black rounded-sm pl-4 pr-10 py-2.5 text-sm font-black uppercase text-black focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
                  <option value="">All Activities</option>
                  <option value="payout">Payouts</option>
                  <option value="status">Status Updates</option>
                  <option value="start">Task Started</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-black font-black pointer-events-none">
                  arrow_drop_down
                </span>
              </div>
              <div className="relative w-full md:w-auto">
                <select className="w-full md:w-40 appearance-none bg-[#93C5FD] border-2 border-black rounded-sm pl-4 pr-10 py-2.5 text-sm font-black uppercase text-black focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
                  <option value="30">Last 30 Days</option>
                  <option value="7">Last 7 Days</option>
                  <option value="90">Last 90 Days</option>
                  <option value="all">All Time</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-black font-black pointer-events-none">
                  arrow_drop_down
                </span>
              </div>
            </div>
          </div>

          {/* Data Table Container - Neo Brutalism */}
          <div className="bg-white dark:bg-slate-900 rounded-md border-2 border-black dark:border-white overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-[#F4F5F0] dark:bg-slate-800 border-b-2 border-black dark:border-white transition-colors">
                  <tr>
                    <th className="px-6 py-4 text-xs font-black text-black dark:text-slate-300 uppercase tracking-wider border-r-2 border-black dark:border-white">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-black dark:text-slate-300 uppercase tracking-wider border-r-2 border-black dark:border-white">
                      Task Name
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-black dark:text-slate-300 uppercase tracking-wider border-r-2 border-black dark:border-white">
                      Activity
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-black dark:text-slate-300 uppercase tracking-wider border-r-2 border-black dark:border-white">
                      Details
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-black dark:text-slate-300 uppercase tracking-wider text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black dark:divide-white text-sm font-bold transition-colors">
                  {dynamicLogs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-slate-500 uppercase"
                      >
                        Belum ada riwayat aktivitas yang tercatat.
                      </td>
                    </tr>
                  ) : (
                    dynamicLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-slate-700 dark:text-slate-400 border-r-2 border-black dark:border-white border-dashed">
                          {log.date}
                        </td>
                        <td className="px-6 py-4 font-black text-black dark:text-white uppercase border-r-2 border-black dark:border-white border-dashed">
                          {log.taskName}
                        </td>
                        <td className="px-6 py-4 text-black dark:text-slate-300 uppercase border-r-2 border-black dark:border-white border-dashed">
                          {log.activity}
                        </td>
                        <td
                          className={`px-6 py-4 border-r-2 border-black dark:border-white border-dashed uppercase transition-colors ${log.details.includes("+") ? "text-green-600 dark:text-green-400 font-black" : "text-slate-700 dark:text-slate-400"}`}
                        >
                          {log.details}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 text-[10px] font-black uppercase transition-all ${getStatusBadge(log.status)}`}
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

            {/* Pagination Footer - Neo Brutalism */}
            <div className="bg-[#F4F5F0] dark:bg-slate-900 border-t-2 border-black dark:border-white px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
              <span className="text-sm font-black uppercase text-black dark:text-white">
                Showing {dynamicLogs.length} entries
              </span>
              <div className="flex gap-2">
                <button
                  disabled
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 border-2 border-black dark:border-white text-slate-500 font-black uppercase text-xs rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] opacity-50 cursor-not-allowed"
                >
                  Previous
                </button>
                <button className="px-4 py-2 bg-[#A3E635] text-black border-2 border-black font-black uppercase text-xs rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  1
                </button>
                <button
                  disabled
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 border-2 border-black dark:border-white text-slate-500 font-black uppercase text-xs rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] opacity-50 cursor-not-allowed"
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
