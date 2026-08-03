/**
 * Metadados padrão das áreas privadas: sempre noindex e sem og:image,
 * pois nenhuma dessas páginas deve ser indexada ou compartilhada.
 */
export function privateHead(title: string, description: string, path: string) {
  const fullTitle = `${title} — MU Kame`;
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: `https://novo.mukame.online${path}` }],
  };
}
