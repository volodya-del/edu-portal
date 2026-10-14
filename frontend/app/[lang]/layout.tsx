import Link from "next/link";
import { notFound } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { dictionary, isLocale } from "@/lib/i18n";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = dictionary[lang];

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-line bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href={`/${lang}/courses`} className="flex items-center gap-2 text-lg font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-white">E</span>
            Edu Portal
          </Link>
          <LanguageSwitcher lang={lang} />
        </div>
      </header>
      {children}
      <footer className="mt-16 border-t border-line py-8 text-center text-sm text-muted">
        {t.footer}
      </footer>
    </>
  );
}