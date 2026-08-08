import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { Inter, Vazirmatn } from 'next/font/google';
import { routing } from '@/i18n/routing';
import ThemeRegistry from '@/theme/ThemeRegistry';
import AppShell from '@/components/AppShell';
import QueryProvider from '@/components/QueryProvider';
import '../globals.css';

export const metadata: Metadata = {
  title: 'AI Knowledge Base',
  description: 'RAG-powered knowledge base for your team',
};

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const vazirmatn = Vazirmatn({ subsets: ['arabic'], variable: '--font-vazirmatn' });

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const direction = locale === 'fa' ? 'rtl' : 'ltr';
  const fontVariable = locale === 'fa' ? vazirmatn.variable : inter.variable;

  return (
    <html lang={locale} dir={direction} className={`${inter.variable} ${vazirmatn.variable}`}>
      <body
        style={{
          ['--font-body' as string]:
            locale === 'fa'
              ? 'var(--font-vazirmatn), Tahoma, "Segoe UI", sans-serif'
              : 'var(--font-inter), "Segoe UI", sans-serif',
        }}
        className={fontVariable}
      >
        <NextIntlClientProvider locale={locale}>
          <QueryProvider>
            <ThemeRegistry direction={direction}>
              <AppShell>{children}</AppShell>
            </ThemeRegistry>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
