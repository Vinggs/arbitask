import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { prisma } from "@/lib/prisma";
import DashboardFilters from "../../components/DashboardFilters";
import OfferRow from "../../components/OfferRow";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getTranslations } from "next-intl/server";

export default async function DashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>; // <-- Tambahkan parameter ini
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email || "";

  // Await parameter routing (locale) dan search/query parameter
  const resolvedParams = await params;
  const sParams = await searchParams;

  const currentCategory = sParams.category;
  const searchQuery = sParams.q;

  // Inisialisasi translasi dengan mendefinisikan namespace dan locale secara eksplisit
  const t = await getTranslations({
    namespace: "Dashboard",
    locale: resolvedParams.locale,
  });

  const offers = await prisma.catalogOffer.findMany({
    where: {
      category:
        currentCategory && currentCategory !== "All"
          ? currentCategory
          : undefined,
      ...(searchQuery
        ? {
            gameName: {
              contains: searchQuery,
              mode: "insensitive",
            },
          }
        : {}),
    },
    orderBy: { usdValue: "desc" },
    include: { milestones: true },
  });

  const totalTasks = await prisma.task.count({
    where: { user: { email: userEmail } },
  });

  const trackedTasks = await prisma.task.findMany({
    where: { user: { email: userEmail } },
    select: { name: true, offerwall: true, status: true },
  });

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={t("overview")} />

        <main className="flex-1 p-3 md:p-8 max-w-7xl mx-auto w-full">
          {/* STAT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
            <div className="p-4 md:p-6 bg-blue-300 dark:bg-sky-800 rounded-md border-2 border-slate-900 dark:border-slate-700 shadow-brutal dark:shadow-brutal-dark transition-colors">
              <p className="text-[10px] md:text-sm font-black uppercase tracking-widest text-slate-900 dark:text-slate-200">
                {t("totalTrackedTasks")}
              </p>
              <p className="text-3xl md:text-5xl font-black mt-1 md:mt-0 text-slate-900 dark:text-white">
                {totalTasks}
              </p>
            </div>

            <div className="p-4 md:p-6 bg-emerald-400 dark:bg-teal-700 rounded-md border-2 border-slate-900 dark:border-slate-700 shadow-brutal dark:shadow-brutal-dark transition-colors">
              <p className="text-[10px] md:text-sm font-black uppercase tracking-widest text-slate-900 dark:text-slate-200">
                {t("syncedOfferwalls")}
              </p>
              <p className="text-3xl md:text-5xl font-black mt-1 md:mt-0 text-slate-900 dark:text-white">
                {offers.length}
              </p>
            </div>

            <div className="p-4 md:p-6 bg-white dark:bg-slate-900 rounded-md border-2 border-slate-900 dark:border-slate-700 shadow-brutal dark:shadow-brutal-dark transition-colors">
              <p className="text-[10px] md:text-sm font-black uppercase tracking-widest text-slate-900 dark:text-slate-400">
                {t("bestArbitrage")}
              </p>
              <p className="text-3xl md:text-5xl font-black text-emerald-600 dark:text-teal-400 mt-1 md:mt-0">
                $
                {(offers.length >= 2
                  ? offers[0].usdValue - offers[1].usdValue
                  : 0
                ).toFixed(2)}
              </p>
            </div>
          </div>

          <DashboardFilters />

          {/* TABLE */}
          <div className="bg-white dark:bg-slate-900 rounded-md border-2 border-slate-900 dark:border-slate-700 shadow-brutal-lg dark:shadow-brutal-dark-lg overflow-x-auto transition-colors">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b-2 border-slate-900 dark:border-slate-700 text-[10px] md:text-xs uppercase font-black bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-200">
                  <th className="p-3 md:p-4 border-r-2 border-slate-900 dark:border-slate-700 whitespace-nowrap">
                    {t("tableTaskName")}
                  </th>
                  <th className="p-3 md:p-4 border-r-2 border-slate-900 dark:border-slate-700 whitespace-nowrap">
                    {t("tablePlatform")}
                  </th>
                  <th className="p-3 md:p-4 border-r-2 border-slate-900 dark:border-slate-700 whitespace-nowrap">
                    {t("tableRawCoins")}
                  </th>
                  <th className="p-3 md:p-4 border-r-2 border-slate-900 dark:border-slate-700 whitespace-nowrap">
                    {t("tableUsdValue")}
                  </th>
                  <th className="p-3 md:p-4 text-center whitespace-nowrap">
                    {t("tableAction")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-900 dark:divide-slate-700 bg-white dark:bg-slate-900">
                {offers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-sm font-bold uppercase text-slate-600 dark:text-slate-400"
                    >
                      {t("noTasksFound")}
                    </td>
                  </tr>
                ) : (
                  offers.map((offer) => {
                    const combinedOfferwall = `${offer.platform} - ${offer.offerwall}`;

                    const existingTask = trackedTasks.find(
                      (task) =>
                        task.name.toLowerCase() ===
                          offer.gameName.toLowerCase() &&
                        task.offerwall === combinedOfferwall &&
                        (task.status === "In Progress" ||
                          task.status === "Dropped"),
                    );

                    const taskStatus = existingTask
                      ? existingTask.status
                      : null;

                    return (
                      <OfferRow
                        key={offer.id}
                        offer={offer}
                        taskStatus={taskStatus}
                        userEmail={userEmail}
                      />
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
