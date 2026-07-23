import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

const locales = ["en", "id"];

export default getRequestConfig(async ({ requestLocale }) => {
  // Tunggu promise requestLocale (Wajib di Next.js 15/16)
  let locale = await requestLocale;

  if (!locales.includes(locale as any)) notFound();

  return {
    locale: locale as string, // <-- Tetap pertahankan 'as string' di sini
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
