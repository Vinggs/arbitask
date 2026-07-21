import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Kalau lolos pengecekan di bawah, lanjut terus
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Cek apakah user lagi nyoba buka URL yang depannya /admin
        if (req.nextUrl.pathname.startsWith("/admin")) {
          // GANTI SAMA EMAIL UTAMA LU YANG JADI ADMIN
          // Kalau emailnya nggak cocok, otomatis ditendang balik ke halaman login/home
          return token?.email === "farrellshand@gmail.com";
        }

        // Buat halaman lain yang butuh login (kalau ada), asalkan punya token = boleh masuk
        return !!token;
      },
    },
  },
);

export const config = {
  // Terapin middleware ini khusus buat folder admin aja
  matcher: ["/admin/:path*"],
};
