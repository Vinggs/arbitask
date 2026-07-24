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

// 2. Inisialisasi Middleware Auth
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

  // Kalau next-auth menolak (karena belum login) dan memaksa redirect ke /login, jalankan redirect-nya
  if (authResponse?.status === 307 || authResponse?.status === 302) {
    return authResponse;
  }

  // Kalau auth tembus, jalankan middleware bahasa
  return intlMiddleware(req);
}

export const config = {
  // ✅ PENTING: Mengecualikan api, _next, _vercel, dan file statis lainnya dari middleware
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
