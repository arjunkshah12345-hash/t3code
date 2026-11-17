import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const sitemap = site ? `\nSitemap: ${new URL(`${base}/sitemap.xml`, site).href}` : "";
  return new Response(`User-agent: *\nAllow: /${sitemap}\n`, { headers: { "Content-Type": "text/plain" } });
};
