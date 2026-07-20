import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { isPublicLocale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  if (!isPublicLocale(locale)) notFound();
  const messages = (await import(`../../messages/${locale}.json`)).default;
  return { locale, messages };
});
