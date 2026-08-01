async function getHealth() {
  const res = await fetch("http://localhost:3001/health", {
    cache: "no-store",
  });
  return res.json();
}

export default async function Home() {
  const health = await getHealth();
  return <div>API says: {health.status}</div>;
}
