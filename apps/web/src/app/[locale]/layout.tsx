import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import ThemeRegistry from '@/theme/ThemeRegistry';
import AppShell from '@/components/AppShell';
import '../globals.css';

export const metadata: Metadata = {
  title: 'AI Knowledge Base',
  description: 'RAG-powered knowledge base for your team',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const direction = locale === 'fa' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction}>
      <body>
        <NextIntlClientProvider locale={locale}>
          <ThemeRegistry direction={direction}>
            <AppShell>{children}</AppShell>
          </ThemeRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}