import { withAuth } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

const locales = ["en", "id"];

// 1. Inisialisasi Middleware Bahasa
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
});

// 2. Inisialisasi Middleware Auth (Hapus fungsi onSuccess yang lama)
const authMiddleware = withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const path = req.nextUrl.pathname;

      if (path.includes("/admin")) {
        return token?.email === "farrellshand@gmail.com";
      }

      if (path.includes("/login")) {
        return true;
      }

      return !!token;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export default async function middleware(req: NextRequest) {
  const isLoginPage = req.nextUrl.pathname.includes("/login");

  // Kalau halaman login/public, langsung tangani bahasanya
  if (isLoginPage) {
    return intlMiddleware(req);
  }

  // Jalankan next-auth untuk verifikasi sesi
  const authResponse = await (authMiddleware as any)(req);

  // Kalau next-auth menolak (karena belum login) dan memaksa redirect ke /login (status 302/307), jalankan redirect-nya
  if (authResponse?.status === 307 || authResponse?.status === 302) {
    return authResponse;
  }

  // KUNCI UTAMANYA DI SINI:
  // Kalau auth tembus, jalankan middleware bahasa di luar.
  // Ini mencegah next-auth "memakan" header penting milik next-intl.
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
