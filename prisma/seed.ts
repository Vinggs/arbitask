// File: prisma/seed.ts
import { PrismaClient } from "@prisma/client";

// Karena ini file terpisah dari runtime Next.js, kita inisiasi instance Prisma baru
// khusus untuk proses seeding di terminal.
const prisma = new PrismaClient();

// 1. Array Data Master
// Tinggal copy-paste object di bawah ini kalau mau nambah game baru
const catalogData = [
  {
    gameName: "Monopoly GO",
    imageUrl: "https://img.poki-cdn.com/monopoly-go.png", // Opsional, bisa string kosong atau hapus jika tidak ada
    category: "Games",
    platform: "Swagbucks",
    offerwall: "RevU",
    rawCoins: 5250,
    usdValue: 52.5,
    requirement: "Reach Board 71",
    isHighest: true,
    // Ini relasi ke model CatalogMilestone
    milestones: [
      { description: "Reach Board 2", reward: 0.5 },
      { description: "Reach Board 10", reward: 2.0 },
      { description: "Reach Board 42", reward: 15.0 },
      { description: "Reach Board 71", reward: 35.0 },
    ],
  },
  {
    gameName: "Candy Crush Saga",
    imageUrl: "https://img.poki-cdn.com/candy-crush.png",
    category: "Games",
    platform: "Freecash",
    offerwall: "ToroX",
    rawCoins: 3500,
    usdValue: 35.0,
    requirement: "Complete Level 100",
    isHighest: false,
    milestones: [
      { description: "Complete Level 10", reward: 1.0 },
      { description: "Complete Level 50", reward: 9.0 },
      { description: "Complete Level 100", reward: 25.0 },
    ],
  },
];

async function main() {
  console.log("Memulai proses seeding data katalog...");

  // 2. Bersihkan data lama agar tidak duplikat saat di-seed ulang (Opsional tapi direkomendasikan)
  // Cascade delete di skema akan otomatis menghapus CatalogMilestone terkait
  await prisma.catalogOffer.deleteMany();
  console.log("Data lama berhasil dibersihkan.");

  // 3. Looping untuk menyuntikkan data beserta relasinya
  for (const game of catalogData) {
    await prisma.catalogOffer.create({
      data: {
        gameName: game.gameName,
        imageUrl: game.imageUrl,
        category: game.category,
        platform: game.platform,
        offerwall: game.offerwall,
        rawCoins: game.rawCoins,
        usdValue: game.usdValue,
        requirement: game.requirement,
        isHighest: game.isHighest,
        // Menyuntikkan langsung ke model CatalogMilestone sesuai skema
        milestones: {
          create: game.milestones,
        },
      },
    });
    console.log(
      `Berhasil insert: ${game.gameName} beserta ${game.milestones.length} milestones.`,
    );
  }

  console.log(
    "🎉 Seeding selesai! Seluruh data katalog dan tier berhasil masuk database.",
  );
}

main()
  .catch((e) => {
    console.error("Terjadi kesalahan saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
