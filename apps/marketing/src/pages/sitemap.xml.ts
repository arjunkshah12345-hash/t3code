import type { APIRoute } from "astro";

const PAGES = ["/", "/download/", "/legal/", "/privacy-policy/", "/security-policy/", "/terms-of-service/"];

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const origin = site ?? new URL("http://localhost");
  const urls = PAGES.map((path) => `  <url><loc>${new URL(`${base}${path}`, origin).href}</loc></url>`).join("\n");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { "Content-Type": "application/xml" },
  });
};
