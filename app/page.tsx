import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Panggil komponen Sidebar yang sudah ada navigasinya */}
      <Sidebar />

      {/* Main Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Panggil komponen Header */}
        <Header title="Overview" />

        {/* Main Content Canvas */}
        <main className="flex-1 p-margin-desktop max-w-container-max mx-auto w-full">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-lg">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-sm">
              <h3 className="font-label-md text-on-surface-variant mb-2">
                Total Task Terlacak
              </h3>
              <div className="font-display-lg text-[32px] text-primary">
                124
              </div>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-sm">
              <h3 className="font-label-md text-on-surface-variant mb-2">
                Offerwall Tersinkronisasi
              </h3>
              <div className="font-display-lg text-[32px] text-primary">8</div>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-sm">
              <h3 className="font-label-md text-on-surface-variant mb-2">
                Peluang Arbitrase Terbaik
              </h3>
              <div className="font-display-lg text-[32px] text-secondary">
                +$14.50
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <section className="mb-stack-lg flex flex-wrap gap-stack-md items-center">
            <div className="flex items-center gap-2 mr-4">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">
                filter_list
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Filters
              </span>
            </div>
            <div className="flex items-center gap-2 border border-outline-variant rounded-full px-4 py-1.5 bg-surface-container-lowest shadow-sm hover:border-primary-container transition-colors cursor-pointer">
              <span className="font-label-md text-label-md text-primary">
                Platform: All
              </span>
              <span className="material-symbols-outlined text-sm text-on-surface-variant">
                expand_more
              </span>
            </div>
            <div className="flex items-center gap-2 border border-outline-variant rounded-full px-4 py-1.5 bg-surface-container-lowest shadow-sm hover:border-primary-container transition-colors cursor-pointer">
              <span className="font-label-md text-label-md text-primary">
                Withdrawal: All
              </span>
              <span className="material-symbols-outlined text-sm text-on-surface-variant">
                expand_more
              </span>
            </div>
            <div className="ml-auto">
              <button className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">
                  clear_all
                </span>
                Clear Filters
              </button>
            </div>
          </section>

          {/* Comparison Table Area */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden mb-margin-desktop shadow-sm">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-outline-variant bg-surface-bright">
              <div className="col-span-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
                Task Name
              </div>
              <div className="col-span-2 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
                Offerwall
              </div>
              <div className="col-span-2 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest text-right">
                Raw Coins
              </div>
              <div className="col-span-2 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest text-right">
                USD Value
              </div>
              <div className="col-span-2 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest text-right">
                Action
              </div>
            </div>

            <div className="flex flex-col">
              {/* Row 1: RevU (Highest) */}
              <div className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-outline-variant items-center hover:bg-surface-bright transition-colors group relative">
                <div className="absolute left-0 top-0 h-full w-1 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="col-span-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      className="w-8 h-8 object-contain"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCo8eD_CxMUiDIbQAFfZPmmkJFy0cpZ90cYdADyLad9a9l8xhMBnYJkZNV8lO2_EG89O65w1efIxtwzFS1UJFu6F1CSFA1ibTrnIwy6Dpbx9LWWKytMMTtn_uG_76n2E6DESBRkN2X3YE_yC1k1AxmzvaIQrcP4eM9WOvM0r8a4flTm1YzfpWSN4lrhpQ8eP05u8Oe5DlWLirCnhc34LfuwrwvtVz3-Wr0JINiM1ZyToRNrKwbJrT3m8NqCeIRCkqaU8WF76Ipr2jI"
                      alt="Icon"
                    />
                  </div>
                  <div>
                    <div className="font-headline-md text-headline-md text-primary text-[18px]">
                      Monopoly GO
                    </div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant mt-1 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px]">
                        videogame_asset
                      </span>{" "}
                      Level 71 requirement
                    </div>
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center bg-white shrink-0">
                    <span className="font-label-md text-label-md text-primary">
                      RU
                    </span>
                  </div>
                  <span className="font-body-md text-body-md text-primary font-medium">
                    RevU
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-end font-body-md text-body-md text-on-surface-variant">
                  5,250
                </div>
                <div className="col-span-2 flex flex-col items-end justify-center">
                  <div className="font-headline-md text-[20px] text-secondary font-bold">
                    $52.50
                  </div>
                  <div className="mt-1 bg-secondary/10 text-secondary border border-secondary/20 px-2 py-0.5 rounded-full font-label-sm text-[10px] flex items-center gap-1">
                    Highest{" "}
                    <span className="material-symbols-outlined text-[12px]">
                      local_fire_department
                    </span>
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-end">
                  <button className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      add
                    </span>{" "}
                    Track
                  </button>
                </div>
              </div>

              {/* Row 2: ToroX */}
              <div className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-outline-variant items-center hover:bg-surface-bright transition-colors group relative">
                <div className="absolute left-0 top-0 h-full w-1 bg-outline-variant opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="col-span-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      className="w-8 h-8 object-contain"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiMO6HIeyEzmiTIjJggsvd2PFOAQMrchlBF5PD3InVt8iu1L3yEtDZxucWmhWukRMEPLZSJg_ElxMTT6fe9MlskqBj1YUgsVRG0ENp0h6Gw-nFRFmeSxZ6ha1KuaG2VwlHdnfipXNMfRnFitAgLHQLmCZjLyzMUdWpXjErTWg6lkPgKjwu2wtDaNXJ4gZiocsyrZjILQRgDiyi3GnoMiQ3nfzTrvsiX170Nr8Sa1EB8T2914nNMnlvpRbcQduJZoaaPwvS6VNPEnM"
                      alt="Icon"
                    />
                  </div>
                  <div>
                    <div className="font-headline-md text-headline-md text-primary text-[18px]">
                      Monopoly GO
                    </div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant mt-1 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px]">
                        videogame_asset
                      </span>{" "}
                      Level 71 requirement
                    </div>
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center bg-white shrink-0">
                    <span className="font-label-md text-label-md text-primary">
                      TX
                    </span>
                  </div>
                  <span className="font-body-md text-body-md text-primary font-medium">
                    ToroX
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-end font-body-md text-body-md text-on-surface-variant">
                  4,500
                </div>
                <div className="col-span-2 flex flex-col items-end justify-center">
                  <div className="font-headline-md text-[20px] text-primary font-medium">
                    $45.00
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-end">
                  <button className="border border-outline-variant text-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:border-primary-container hover:bg-surface-container-low transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      add
                    </span>{" "}
                    Track
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Pagination */}
          <section className="flex justify-center mt-stack-md pb-margin-desktop">
            <button className="font-label-md text-label-md text-primary border border-outline-variant px-6 py-2 rounded-full hover:bg-surface-container-lowest transition-colors shadow-sm flex items-center gap-2">
              Load Additional Records
              <span className="material-symbols-outlined text-sm">
                arrow_downward
              </span>
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}
