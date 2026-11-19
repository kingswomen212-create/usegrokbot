import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import { notFound } from "next/navigation";
import { FlintApp } from "@/components/flint/FlintApp";
import { isUrlLocale, urlToLocale, type UrlLocale } from "@/lib/i18n/paths";
import { studioCopy } from "@/lib/flint/studio";

const serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-flint-serif",
  display: "swap",
});

const TITLES: Record<UrlLocale, string> = {
  en: "Describe it. Use it.",
  "zh-hk": "描述它，然後直接使用",
  "zh-cn": "描述它，然后直接使用",
  ja: "書いて、すぐ使う。",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isUrlLocale(locale)) return {};
  const copy = studioCopy(urlToLocale[locale]);
  return {
    title: TITLES[locale],
    description: copy.lede,
    robots: { index: false, follow: false },
  };
}

export default async function FlintPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isUrlLocale(locale)) notFound();
  return (
    <div className={`${serif.variable} flint-root`} data-flint-page="">
      <FlintApp locale={urlToLocale[locale]} urlLocale={locale} />
    </div>
  );
}
