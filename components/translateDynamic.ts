// file: translateDynamic.ts

export function translateDynamicText(text: string, locale: string): string {
  // Kalau bahasanya bukan Indonesia atau teksnya kosong, kembalikan teks aslinya
  if (locale !== "id" || !text) return text;

  // Ubah ke huruf kapital semua agar deteksi regex lebih mudah
  let translated = text.toUpperCase();

  // POLA 1: "PLAY THE GAME AND COMPLETE THE TASKS IN [X] DAYS."
  translated = translated.replace(
    /PLAY THE GAME AND COMPLETE THE TASKS IN (\d+) DAYS\.?/g,
    "MAINKAN GAME DAN SELESAIKAN TUGAS DALAM $1 HARI.",
  );

  // POLA 2: "PLAY THE GAME AND COMPLETE THE TASKS."
  translated = translated.replace(
    /PLAY THE GAME AND COMPLETE THE TASKS\.?/g,
    "MAINKAN GAME DAN SELESAIKAN TUGAS.",
  );

  // POLA 3: "OPEN AND PLAY THE GAME"
  translated = translated.replace(
    /OPEN AND PLAY THE GAME\.?/g,
    "BUKA DAN MAINKAN GAME",
  );

  // POLA 4: "COLLECT [Angka] [Item]" -> misal: COLLECT 75 GEMS
  // $1 akan menangkap angkanya, $2 akan menangkap sisa kata di belakangnya
  translated = translated.replace(/COLLECT (\d+) (.*)/g, "KUMPULKAN $1 $2");

  // POLA 5: "REACH LEVEL [Angka]"
  translated = translated.replace(/REACH LEVEL (\d+)/g, "CAPAI LEVEL $1");

  // POLA 6: "RANK TOP [Angka] IN [Angka] TOURNAMENTS"
  translated = translated.replace(
    /RANK TOP (\d+) IN (\d+) TOURNAMENTS/g,
    "RAIH PERINGKAT $1 BESAR DI $2 TURNAMEN",
  );

  translated = translated.replace(
    /BUILD CYBER MALL! PLAY THE GAME AND CONSTRUCT CYBER MALL\.?/g,
    "BANGUN CYBER MALL! MAINKAN GAME DAN BANGUN CYBER MALL.",
  );

  // POLA BARU: Trump's Empire (pakai regex penangkap kata biar dinamis)
  // $1 akan menangkap kata apapun setelah "BUILD " (contoh: "A FLORIDA PRIVATE CLUB")
  translated = translated.replace(
    /PLAY THE GAME AND BUILD (.*)\.?/g,
    "MAINKAN GAME DAN BANGUN $1.",
  );

  // Jika ada pola lain di masa depan, kamu tinggal tambahkan regex-nya di sini!

  return translated;
}
