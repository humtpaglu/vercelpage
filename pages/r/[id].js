// pages/r/[id].js
// Server-side redirect page - fetches resolved URL from API and redirects.

export async function getServerSideProps({ params }) {
  const { id } = params;

  const api = `https://vercelking.vercel.app/api/resolve/${id}`;

  try {
    const res = await fetch(api);
    if (!res.ok) {
      return { notFound: true };
    }
    const data = await res.json();
    if (!data || !data.url) {
      return { notFound: true };
    }
    return {
      redirect: {
        destination: data.url,
        permanent: false,
      },
    };
  } catch (err) {
    console.error("Redirect error:", err);
    return { notFound: true };
  }
}

export default function RedirectPage() {
  return null;
}
