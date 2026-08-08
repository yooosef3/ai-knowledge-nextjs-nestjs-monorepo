import { getTranslations } from 'next-intl/server';

async function getHealth() {
  const res = await fetch('http://localhost:3001/health', {
    cache: 'no-store',
  });
  return res.json();
}

export default async function Home() {
  const t = await getTranslations('Home');
  const health = await getHealth();

  return (
    <div>
      {t('apiStatus', { status: health.status })}
    </div>
  );
}
