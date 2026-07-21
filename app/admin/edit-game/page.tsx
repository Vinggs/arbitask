import { prisma } from "@/lib/prisma";
import AdminOfferRow from "@/components/AdminOfferRow";
import { updateOfferAction } from "@/app/actions";

export default async function AdminEditGamePage() {
  const catalogOffers = await prisma.catalogOffer.findMany({
    include: {
      milestones: true,
    },
    orderBy: { gameName: "asc" },
  });

  return (
    // ✅ FIX: Pading disesuaikan untuk HP
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
      <h1 className="text-2xl md:text-3xl font-black uppercase mb-4 md:mb-6 border-b-4 border-black pb-2">
        Admin Panel - Edit Database Game
      </h1>

      {/* ✅ FIX: Wrapper overflow-x-auto biar tabel bisa di-scroll di HP */}
      <div className="w-full overflow-x-auto border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
        <table className="w-full min-w-[800px] text-left border-collapse">
          <tbody>
            {catalogOffers.map((offer) => (
              <AdminOfferRow
                key={offer.id}
                offer={offer}
                updateOfferAction={updateOfferAction}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
