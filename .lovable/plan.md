# SEO Audit and Fixes Plan - MU Kame

Auditing all content routes to ensure high-fidelity SEO metadata following TanStack Start v1 patterns.

## Audit Checklist (SEO-Critical)
1. **Unique Titles & Descriptions**: Every leaf route must have its own metadata.
2. **Open Graph (OG)**: Check for `og:title`, `og:description`, `og:type`, and `og:url`.
3. **Twitter Cards**: Check for `twitter:card`, `twitter:title`, and `twitter:description`.
4. **Canonical Tags**: Ensure each route has a canonical link to its primary URL.
5. **Head Hierarchy**: Verify H1 presence and semantic structure in components.
6. **JSON-LD**: Ensure basic Organization schema in root and potential additions for other routes.

## Implementation Steps

### 1. Root & Base Meta (`src/routes/__root.tsx`)
- Ensure base Open Graph tags (`og:site_name`, `og:locale`) are set.
- Check favicon and generic scripts.

### 2. Main Routes Metadata
- **Index (`/`)**: Strengthen the primary landing page metadata.
- **Downloads (`/downloads`)**: Ensure precise title and description for high-intent keywords.
- **Rankings (`/rankings/*`)**: Add specific head() blocks for sub-routes (reset, master-reset, level, etc.) which currently inherit or lack specific titles.
- **News (`/noticias/*`)**: 
  - Ensure `/noticias` has its own title.
  - Fix the `/noticias/$slug` route which has hardcoded "Comunicado" titles; it should ideally use data from the loader (if available) or at least be unique.
- **Auth/Account (`/entrar`, `/criar-conta`, `/area-do-jogador`)**: Add `robots: "noindex"` where appropriate and ensure canonicals.
- **CMS/Info (`/regras`, `/suporte`, `/eventos`, `/castle-siege`)**: Verify and fix missing canonicals or OG tags.

### 3. Dynamic Metadata for News
- Refactor `src/routes/noticias.$slug.tsx` to use a loader that provides the news title for the `head()` function.

### 4. Semantic HTML Fixes
- Audit components (`Hero`, `PageHero`, `SectionHeading`) to ensure `h1` is correctly used once per page.

## Technical Details
- Using TanStack Start `head()` option in `createFileRoute`.
- All absolute URLs will point to `https://novo.mukame.online`.
