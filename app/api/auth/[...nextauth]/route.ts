import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Import Semua Provider
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
// FacebookProvider dihapus karena di-skip
import TwitterProvider from "next-auth/providers/twitter";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";

// PISAHIN KONFIGURASINYA DAN KASIH EXPORT DI SINI
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // 1. Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    // 2. GitHub
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),

    // 3. Discord
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),

    // 4. Twitter / X
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      version: "2.0", // Wajib pake API v2 buat Twitter
    }),

    // 5. Magic Link (Email Biasa)
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),

    // 6. Manual Email & Password (Credentials)
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@kamu.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // PERHATIAN: Di sini butuh logika tambahan buat ngecek password pakai bcrypt
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (user) return user;
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  // TAMBAHAN BARU: Biar nama otomatis ke-update tanpa perlu relogin
  callbacks: {
    async jwt({ token, trigger, session }) {
      // Tangkap perintah update dari halaman profil
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
      return token;
    },
    async session({ session, token }) {
      // Salin nama baru dari token ke session browser
      if (session.user) {
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// PANGGIL KONFIGURASINYA DI SINI
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
