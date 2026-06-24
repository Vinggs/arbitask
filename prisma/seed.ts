// Kita TIDAK bikin new PrismaClient(), tapi pakai yang sudah lu setting di project Next.js!
// Catatan: Kalau folder lib lu ada di dalam folder 'src', ubah path-nya jadi '../src/lib/prisma'
import { prisma } from "../lib/prisma";

async function main() {
  console.log("Mulai menyuntikkan data katalog...");

  await prisma.catalogOffer.createMany({
    data: [
      {
        gameName: "Monopoly GO",
        platform: "Android",
        offerwall: "RevU",
        rawCoins: 5250,
        usdValue: 52.5,
        requirement: "Level 71 requirement",
        isHighest: true,
      },
      {
        gameName: "Monopoly GO",
        platform: "Android",
        offerwall: "ToroX",
        rawCoins: 4500,
        usdValue: 45.0,
        requirement: "Level 71 requirement",
        isHighest: false,
      },
      {
        gameName: "Raid: Shadow Legends",
        platform: "PC",
        offerwall: "Freecash",
        rawCoins: 12000,
        usdValue: 120.0,
        requirement: "Open 2 Sacred Shards",
        isHighest: true,
      },
    ],
  });

  console.log("Selesai! Database katalog sudah terisi.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Mematikan proses setelah sukses supaya terminalnya nggak ngegantung
    process.exit(0);
  });
