import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Success":
    case "Completed":
      return "bg-emerald-400 dark:bg-teal-700 text-slate-900 dark:text-slate-100 border-2 border-slate-900 dark:border-slate-700 shadow-brutal-sm dark:shadow-brutal-dark-sm";
    case "Processing":
    case "In Progress":
      return "bg-blue-300 dark:bg-sky-700 text-slate-900 dark:text-slate-100 border-2 border-slate-900 dark:border-slate-700 shadow-brutal-sm dark:shadow-brutal-dark-sm";
    case "Dropped":
    case "Alert":
      return "bg-red-400 dark:bg-rose-800 text-slate-900 dark:text-slate-100 border-2 border-slate-900 dark:border-slate-700 shadow-brutal-sm dark:shadow-brutal-dark-sm";
    default:
      return "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 border-2 border-slate-900 dark:border-slate-700 shadow-brutal-sm dark:shadow-brutal-dark-sm";
  }
};

export default async function LogHistoryPage() {
  const t = await getTranslations("LogHistory");
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

    let activityText = t("activityStart");
    let detailsText = t("detailInitiated", { offerwall: task.offerwall });

    if (task.status === "Dropped") {
      activityText = t("activityDropped");
      detailsText = t("detailDropped");
    } else if (task.status === "Completed") {
      activityText = t("activityCompleted");
      detailsText = t("detailCompleted");
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
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header title={t("title")} />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <header className="mb-6 md:mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 uppercase">
              {t("title")}
            </h2>
            <p className="text-xs md:text-base font-bold text-slate-600 dark:text-slate-400 max-w-2xl uppercase tracking-wider">
              {t("subtitle")}
            </p>
          </header>

          {/* Filters & Search Toolbar */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-6 bg-white dark:bg-slate-900 p-4 md:p-5 rounded-md border-2 border-slate-900 dark:border-slate-700 shadow-brutal dark:shadow-brutal-dark transition-colors duration-300">
            <div className="w-full lg:w-1/2 relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-900 dark:text-slate-400 text-[20px] font-black">
                search
              </span>
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border-2 border-slate-900 dark:border-slate-700 rounded-sm text-xs md:text-sm font-bold text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none shadow-brutal-sm dark:shadow-brutal-dark-sm focus:-translate-y-1 transition-all"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-auto">
                <select className="w-full sm:w-48 appearance-none bg-amber-300 dark:bg-amber-700 border-2 border-slate-900 dark:border-slate-700 rounded-sm pl-4 pr-10 py-3 text-xs md:text-sm font-black uppercase text-slate-900 dark:text-slate-100 focus:outline-none shadow-brutal-sm dark:shadow-brutal-dark-sm hover:-translate-y-1 hover:shadow-brutal dark:hover:shadow-brutal-dark transition-all cursor-pointer">
                  <option value="">{t("filterAllActivities")}</option>
                  <option value="payout">{t("filterPayouts")}</option>
                  <option value="status">{t("filterStatus")}</option>
                  <option value="start">{t("filterStart")}</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-900 dark:text-slate-100 font-black pointer-events-none">
                  arrow_drop_down
                </span>
              </div>
              <div className="relative w-full sm:w-auto">
                <select className="w-full sm:w-40 appearance-none bg-blue-300 dark:bg-sky-800 border-2 border-slate-900 dark:border-slate-700 rounded-sm pl-4 pr-10 py-3 text-xs md:text-sm font-black uppercase text-slate-900 dark:text-slate-100 focus:outline-none shadow-brutal-sm dark:shadow-brutal-dark-sm hover:-translate-y-1 hover:shadow-brutal dark:hover:shadow-brutal-dark transition-all cursor-pointer">
                  <option value="30">{t("filter30Days")}</option>
                  <option value="7">{t("filter7Days")}</option>
                  <option value="90">{t("filter90Days")}</option>
                  <option value="all">{t("filterAllTime")}</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-900 dark:text-slate-100 font-black pointer-events-none">
                  arrow_drop_down
                </span>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white dark:bg-slate-900 rounded-md border-2 border-slate-900 dark:border-slate-700 overflow-hidden shadow-brutal-lg dark:shadow-brutal-dark-lg transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b-2 border-slate-900 dark:border-slate-700 transition-colors">
                  <tr>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-wider border-r-2 border-slate-900 dark:border-slate-700 whitespace-nowrap">
                      {t("thDate")}
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-wider border-r-2 border-slate-900 dark:border-slate-700 whitespace-nowrap">
                      {t("thTaskName")}
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-wider border-r-2 border-slate-900 dark:border-slate-700 whitespace-nowrap">
                      {t("thActivity")}
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-wider border-r-2 border-slate-900 dark:border-slate-700 whitespace-nowrap">
                      {t("thDetails")}
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-wider text-center whitespace-nowrap">
                      {t("thStatus")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-900 dark:divide-slate-700 text-xs md:text-sm font-bold transition-colors">
                  {dynamicLogs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 md:px-6 py-8 text-center text-slate-500 uppercase"
                      >
                        {t("emptyLog")}
                      </td>
                    </tr>
                  ) : (
                    dynamicLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                      >
                        <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-slate-700 dark:text-slate-400 border-r-2 border-slate-900 dark:border-slate-700 border-dashed">
                          {log.date}
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 font-black text-slate-900 dark:text-slate-200 uppercase border-r-2 border-slate-900 dark:border-slate-700 border-dashed">
                          {log.taskName}
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-slate-900 dark:text-slate-300 uppercase border-r-2 border-slate-900 dark:border-slate-700 border-dashed">
                          {log.activity}
                        </td>
                        <td
                          className={`px-4 md:px-6 py-3 md:py-4 border-r-2 border-slate-900 dark:border-slate-700 border-dashed uppercase transition-colors ${log.details.includes("+") ? "text-emerald-600 dark:text-teal-400 font-black" : "text-slate-700 dark:text-slate-400"}`}
                        >
                          {log.details}
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-center">
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

            {/* Pagination */}
            <div className="bg-slate-50 dark:bg-slate-900 border-t-2 border-slate-900 dark:border-slate-700 px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
              <span className="text-xs md:text-sm font-black uppercase text-slate-900 dark:text-slate-400 tracking-wider">
                {t("showingEntries", { count: dynamicLogs.length })}
              </span>
              <div className="flex gap-2 w-full md:w-auto justify-between md:justify-start">
                <button
                  disabled
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-700 text-slate-500 font-black uppercase text-[10px] md:text-xs rounded-sm opacity-50 cursor-not-allowed"
                >
                  {t("btnPrev")}
                </button>
                <button className="px-4 py-2 bg-emerald-400 dark:bg-teal-700 text-slate-900 dark:text-slate-100 border-2 border-slate-900 dark:border-slate-700 font-black uppercase text-[10px] md:text-xs rounded-sm shadow-brutal-sm dark:shadow-brutal-dark-sm">
                  1
                </button>
                <button
                  disabled
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-700 text-slate-500 font-black uppercase text-[10px] md:text-xs rounded-sm opacity-50 cursor-not-allowed"
                >
                  {t("btnNext")}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
